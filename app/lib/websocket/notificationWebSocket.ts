import { Client, IMessage } from '@stomp/stompjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SockJS = require('sockjs-client');
import { Notification } from '@/app/api/types/notification/notification';
import { ProfileInfoResponse } from '@/app/api/types/my-page/profile';
import { TOKEN_CHANGE_EVENT } from '@/app/lib/utils/token';

type NotificationHandler = (notification: Notification) => void;
type CountHandler = (count: number) => void;
type ErrorHandler = (error: Event | string) => void;
type CloseHandler = () => void;

interface StompSubscription {
  unsubscribe: () => void;
}

class NotificationWebSocket {
  private client: Client | null = null;
  private userId: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isManualDisconnect = false;
  private hasFatalError = false;
  private notificationHandlers: Set<NotificationHandler> = new Set();
  private countHandlers: Set<CountHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private closeHandlers: Set<CloseHandler> = new Set();
  private notificationSubscription: StompSubscription | null = null;
  private countSubscription: StompSubscription | null = null;
  private tokenChangeHandler: (() => void) | null = null;
  private profileInfo: ProfileInfoResponse | null = null;

  private getWebSocketUrl(): string {
    let socketUrl = process.env.NEXT_PUBLIC_API_SOCKET_URL;
    if (socketUrl) {
      if (socketUrl.includes('/ws/native')) {
        socketUrl = socketUrl.replace('/ws/native', '/ws/notifications');
      }
      socketUrl = socketUrl.replace(/^wss:\/\//, 'https://').replace(/^ws:\/\//, 'http://');
      return socketUrl;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    if (!baseUrl) {
      throw new Error(
        'WebSocket URL 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_API_SOCKET_URL 또는 NEXT_PUBLIC_API_BASE_URL을 설정하세요.'
      );
    }

    let httpBaseUrl: string;
    if (baseUrl.startsWith('https://') || baseUrl.startsWith('http://')) {
      httpBaseUrl = baseUrl;
    } else {
      httpBaseUrl = `https://${baseUrl.replace(/^\/\//, '')}`;
    }

    const wsUrl = httpBaseUrl.replace(/\/api\/v1$/, '') + '/ws/notifications';
    return wsUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage.getItem('accessToken');
  }

  setProfileInfo(profileInfo: ProfileInfoResponse | null): void {
    this.profileInfo = profileInfo;
  }

  connect(userId: number): void {
    if (this.client?.connected && this.userId === userId) {
      console.log(`[NotificationWebSocket] 이미 연결되어 있음: user ${userId}`);
      return;
    }

    this.isManualDisconnect = false;
    this.hasFatalError = false;
    this.userId = userId;

    const token = this.getAuthToken();
    if (!token) {
      console.error('[NotificationWebSocket] 인증 토큰이 없습니다.');
      return;
    }

    if (this.client?.connected) {
      this.disconnect();
    }

    const wsUrl = this.getWebSocketUrl();

    try {
      this.client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: () => {
          // STOMP 로그 비활성화
        },
        onConnect: () => {
          this.reconnectAttempts = 0;
          console.log(`[NotificationWebSocket] STOMP 연결 성공: user ${userId}`);

          this.subscribeToNotifications(userId);
          this.subscribeToCount(userId);
        },
        onStompError: (frame) => {
          const errorMessage = frame.headers['message'] || 'STOMP 연결 오류';
          console.error('[NotificationWebSocket] STOMP 오류:', errorMessage, frame);
          this.errorHandlers.forEach((handler) => handler(errorMessage));
        },
        onWebSocketError: (event) => {
          const errorMessage = this.getErrorMessage(event);
          console.error('[NotificationWebSocket] WebSocket 오류:', errorMessage, event);
          this.errorHandlers.forEach((handler) => handler(errorMessage));

          if (this.isFatalError(event)) {
            this.hasFatalError = true;
            console.error('[NotificationWebSocket] 치명적 오류 발생, 재연결 중단');
          }
        },
        onDisconnect: () => {
          console.log('[NotificationWebSocket] 연결 해제됨');
          this.closeHandlers.forEach((handler) => handler());

          if (!this.isManualDisconnect && !this.hasFatalError && userId) {
            this.attemptReconnect(userId);
          } else if (this.hasFatalError) {
            console.error('[NotificationWebSocket] 치명적 오류로 인해 재연결을 중단합니다.');
          }
        },
      });

      this.client.activate();
    } catch (error) {
      console.error('[NotificationWebSocket] 연결 생성 실패:', error);
      this.attemptReconnect(userId);
    }
  }

  private subscribeToNotifications(userId: number): void {
    if (!this.client?.connected) {
      console.error('[NotificationWebSocket] STOMP 클라이언트가 연결되지 않았습니다.');
      return;
    }

    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }

    const destination = `/topic/notifications/${userId}`;
    this.notificationSubscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const notification: Notification = JSON.parse(message.body);
        console.log('[NotificationWebSocket] 알림 수신:', notification);
        this.notificationHandlers.forEach((handler) => handler(notification));
      } catch (error) {
        console.error('[NotificationWebSocket] 알림 파싱 실패:', error, message.body);
      }
    });

    console.log(`[NotificationWebSocket] 알림 구독 완료: ${destination}`);
  }

  private subscribeToCount(userId: number): void {
    if (!this.client?.connected) {
      console.error('[NotificationWebSocket] STOMP 클라이언트가 연결되지 않았습니다.');
      return;
    }

    if (this.countSubscription) {
      this.countSubscription.unsubscribe();
    }

    const destination = `/topic/notifications/${userId}/count`;
    this.countSubscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        const count = typeof data === 'number' ? data : data.count || 0;
        console.log('[NotificationWebSocket] 알림 개수 수신:', count);
        this.countHandlers.forEach((handler) => handler(count));
      } catch (error) {
        console.error('[NotificationWebSocket] 알림 개수 파싱 실패:', error, message.body);
      }
    });

    console.log(`[NotificationWebSocket] 알림 개수 구독 완료: ${destination}`);
  }

  private attemptReconnect(userId: number): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[NotificationWebSocket] 최대 재연결 시도 횟수 초과');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[NotificationWebSocket] ${delay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      if (!this.isManualDisconnect && !this.hasFatalError) {
        this.connect(userId);
      }
    }, delay);
  }

  disconnect(): void {
    this.isManualDisconnect = true;
    this.userId = null;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
      this.notificationSubscription = null;
    }

    if (this.countSubscription) {
      this.countSubscription.unsubscribe();
      this.countSubscription = null;
    }

    if (this.client) {
      if (this.client.connected) {
        this.client.deactivate();
      }
      this.client = null;
    }

    console.log('[NotificationWebSocket] 연결 해제 완료');
  }

  onNotification(handler: NotificationHandler): () => void {
    this.notificationHandlers.add(handler);
    return () => {
      this.notificationHandlers.delete(handler);
    };
  }

  onCount(handler: CountHandler): () => void {
    this.countHandlers.add(handler);
    return () => {
      this.countHandlers.delete(handler);
    };
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  onClose(handler: CloseHandler): () => void {
    this.closeHandlers.add(handler);
    return () => {
      this.closeHandlers.delete(handler);
    };
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  private getErrorMessage(error: Event | string): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof CloseEvent) {
      return `WebSocket 연결 종료: ${error.code} ${error.reason || ''}`;
    }

    if (error instanceof ErrorEvent) {
      return error.message || '알 수 없는 오류';
    }

    return '알 수 없는 오류';
  }

  private isFatalError(event: Event | string): boolean {
    if (typeof event === 'string') {
      const lowerError = event.toLowerCase();
      return (
        lowerError.includes('cors') ||
        lowerError.includes('forbidden') ||
        lowerError.includes('unauthorized') ||
        lowerError.includes('cross-origin') ||
        lowerError.includes('origin')
      );
    }

    if (event instanceof CloseEvent) {
      return event.code === 1002 || event.code === 1003;
    }

    if (event instanceof ErrorEvent) {
      const message = event.message?.toLowerCase() || '';
      return message.includes('cors') || message.includes('cross-origin') || message.includes('origin');
    }

    return false;
  }
}

export const notificationWebSocket = new NotificationWebSocket();

