import { Client, IMessage } from '@stomp/stompjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SockJS = require('sockjs-client');
import { ChatMessage } from '@/app/api/types/chat/chat';
import { ProfileInfoResponse } from '@/app/api/types/my-page/profile';
import { useChatStore } from '@/app/lib/stores/chatStore';
import { TOKEN_CHANGE_EVENT } from '@/app/lib/utils/token';

type MessageHandler = (message: ChatMessage) => void;
type ErrorHandler = (error: Event | string) => void;
type CloseHandler = () => void;

// STOMP subscription 타입 정의
interface StompSubscription {
  unsubscribe: () => void;
}

class ChatWebSocket {
  private client: Client | null = null;
  private roomId: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isManualDisconnect = false; // 수동 연결 해제 여부
  private hasFatalError = false; // 복구 불가능한 오류 (CORS 등) 발생 여부
  private messageHandlers: Set<MessageHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private closeHandlers: Set<CloseHandler> = new Set();
  private subscription: StompSubscription | null = null;
  private pendingMessages: Map<string, ChatMessage> = new Map(); // content + timestamp로 중복 체크
  private tokenChangeHandler: (() => void) | null = null;
  private profileInfo: ProfileInfoResponse | null = null; // 사용자 정보 저장

  private getWebSocketUrl(): string {
    // 환경 변수로 WebSocket URL이 직접 설정된 경우 우선 사용
    let socketUrl = process.env.NEXT_PUBLIC_API_SOCKET_URL;
    if (socketUrl) {
      // /ws/native 경로가 포함되어 있으면 /ws/chat으로 변경 (네이티브 WebSocket 사용 방지)
      if (socketUrl.includes('/ws/native')) {
        socketUrl = socketUrl.replace('/ws/native', '/ws/chat');
        console.log(`[WebSocket] /ws/native 경로 감지, /ws/chat으로 변경: ${socketUrl}`);
      } else {
        console.log(`[WebSocket] 환경 변수에서 WebSocket URL 사용: ${socketUrl}`);
      }
      
      // SockJS 사용을 위해 ws://, wss://를 http://, https://로 변환
      socketUrl = socketUrl.replace(/^wss:\/\//, 'https://').replace(/^ws:\/\//, 'http://');
      
      return socketUrl;
    }

    // 환경 변수가 없으면 기존 로직 사용 (NEXT_PUBLIC_API_BASE_URL 기반)
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    
    if (!baseUrl) {
      throw new Error(
        'WebSocket URL 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_API_SOCKET_URL 또는 NEXT_PUBLIC_API_BASE_URL을 설정하세요.'
      );
    }

    // SockJS 사용: HTTP/HTTPS URL 유지
    let httpBaseUrl: string;
    if (baseUrl.startsWith('https://') || baseUrl.startsWith('http://')) {
      httpBaseUrl = baseUrl;
    } else {
      // 프로토콜이 없는 경우 https:// 추가 (기본적으로 보안 연결 사용)
      httpBaseUrl = `https://${baseUrl.replace(/^\/\//, '')}`;
    }

    // WebSocket 엔드포인트: /ws/chat
    // /api/v1을 제거하고 WebSocket 엔드포인트 추가
    const wsUrl = httpBaseUrl.replace(/\/api\/v1$/, '') + '/ws/chat';
    
    console.log(`[WebSocket] SockJS 연결 시도: ${wsUrl}`);
    
    return wsUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage.getItem('accessToken');
  }

  /**
   * 사용자 프로필 정보 설정 (useMyProfileInfo에서 호출)
   */
  setProfileInfo(profileInfo: ProfileInfoResponse | null): void {
    this.profileInfo = profileInfo;
  }

  connect(roomId: number): void {
    if (this.client?.connected && this.roomId === roomId) {
      console.log(`[WebSocket] 이미 연결되어 있음: room ${roomId}`);
      return; // 이미 연결되어 있음
    }

    // 수동 연결 해제 플래그 및 치명적 오류 플래그 초기화
    this.isManualDisconnect = false;
    this.hasFatalError = false;
    this.disconnect();
    this.roomId = roomId;

    const token = this.getAuthToken();
    if (!token) {
      console.error('[WebSocket] 인증 토큰을 찾을 수 없습니다.');
      return;
    }

    // 토큰 변경 이벤트 리스너 등록 (로그아웃 시 연결 해제)
    if (typeof window !== 'undefined' && !this.tokenChangeHandler) {
      this.tokenChangeHandler = () => {
        const currentToken = this.getAuthToken();
        if (!currentToken && this.client?.connected) {
          console.log('[WebSocket] 토큰이 제거되어 연결을 해제합니다.');
          this.disconnect();
        }
      };
      window.addEventListener(TOKEN_CHANGE_EVENT, this.tokenChangeHandler);
    }

    const wsUrl = this.getWebSocketUrl();

    try {
      // STOMP 클라이언트 생성 (SockJS 사용)
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
          useChatStore.getState().setIsConnected(true);
          console.log(`[WebSocket] STOMP 연결 성공: room ${roomId}`);

          // 순서: 3. 메시지 구독 먼저
          this.subscribeToMessages(roomId);

          // 순서: 4. 채팅방 입장 알림 전송 (구독 후)
          this.sendJoinNotification(roomId);
        },
        onStompError: (frame) => {
          const errorMessage = frame.headers['message'] || 'STOMP 연결 오류';
          console.error('[WebSocket] STOMP 오류:', errorMessage, frame);
          this.errorHandlers.forEach((handler) => handler(errorMessage));
          useChatStore.getState().setIsConnected(false);
        },
        onWebSocketError: (event) => {
          const errorMessage = this.getErrorMessage(event);
          console.error('[WebSocket] WebSocket 오류:', errorMessage, event);
          
          // CORS 오류나 복구 불가능한 오류인지 확인
          const isCorsError = errorMessage.includes('CORS') || 
                             errorMessage.toLowerCase().includes('cors') ||
                             this.isFatalError(event);
          
          if (isCorsError) {
            console.error('[WebSocket] 복구 불가능한 오류 감지 (CORS), 재연결 중단');
            this.hasFatalError = true;
            // 재연결 타이머 취소
            if (this.reconnectTimer) {
              clearTimeout(this.reconnectTimer);
              this.reconnectTimer = null;
            }
            // 즉시 연결 해제
            if (this.client) {
              try {
                this.client.deactivate();
              } catch {
                // 무시
              }
            }
          }
          
          // 에러 메시지를 문자열로 변환하여 전달 (CORS 오류인 경우 명확히 표시)
          const finalErrorMessage = isCorsError 
            ? 'CORS 오류: 서버의 CORS 설정을 확인하세요. localhost에서 다른 도메인으로의 WebSocket 연결이 차단되었습니다.'
            : errorMessage;
          
          this.errorHandlers.forEach((handler) => handler(finalErrorMessage));
          useChatStore.getState().setIsConnected(false);
        },
        onDisconnect: () => {
          console.warn('[WebSocket] 연결 종료', { 
            isManualDisconnect: this.isManualDisconnect,
            hasFatalError: this.hasFatalError 
          });
          useChatStore.getState().setIsConnected(false);
          this.closeHandlers.forEach((handler) => handler());
          
          // 수동 연결 해제가 아니고 치명적 오류가 아닌 경우에만 재연결 시도
          if (!this.isManualDisconnect && !this.hasFatalError && this.roomId) {
            this.attemptReconnect(this.roomId);
          } else if (this.hasFatalError) {
            console.error('[WebSocket] 치명적 오류로 인해 재연결을 중단합니다.');
          }
        },
      });

      // 연결 활성화
      this.client.activate();
    } catch (error) {
      console.error('[WebSocket] 연결 생성 실패:', error);
      this.attemptReconnect(roomId);
    }
  }

  private subscribeToMessages(roomId: number): void {
    if (!this.client?.connected) {
      console.error('[WebSocket] STOMP 클라이언트가 연결되지 않았습니다.');
      return;
    }

    // 기존 구독 해제
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // 메시지 구독: /topic/chatroom/{chatRoomId}
    const destination = `/topic/chatroom/${roomId}`;
    this.subscription = this.client.subscribe(destination, (message: IMessage) => {
      console.log('[WebSocket] 구독 메시지 수신:', {
        destination: message.headers.destination,
        body: message.body,
        headers: message.headers,
      });
      
      try {
        const rawMessage = JSON.parse(message.body);
        console.log('[WebSocket] 원본 메시지:', rawMessage);

        // 서버 메시지 형식에 따라 ChatMessage로 변환
        // 기존 형식: { chatId, senderId, message, date, time, img }
        // 또는 새로운 형식: { id, chatRoomId, senderId, senderName, content, messageType, sentAt }
        let chatMessage: ChatMessage;
        
        if (rawMessage.id && rawMessage.chatRoomId) {
          // 새로운 형식 (ChatMessage)
          chatMessage = rawMessage as ChatMessage;
        } else {
          // 기존 형식 변환
          chatMessage = {
            id: rawMessage.chatId || Date.now(),
            chatRoomId: roomId,
            senderId: rawMessage.senderId,
            senderName: rawMessage.senderName || this.profileInfo?.username || 'Unknown',
            content: rawMessage.message || rawMessage.content || '',
            messageType: rawMessage.img ? 'IMAGE' : 'TEXT',
            sentAt: rawMessage.date && rawMessage.time 
              ? `${rawMessage.date}T${rawMessage.time}` 
              : rawMessage.sentAt || new Date().toISOString(),
          };
        }

        console.log('[WebSocket] 변환된 메시지:', chatMessage);
        
        // 중복 메시지 체크 (optimistic update로 추가한 메시지와 중복 방지)
        // 내용과 시간을 기반으로 중복 체크 (시간 허용 오차: 5초)
        let foundPending = false;
        const sentAtTime = new Date(chatMessage.sentAt).getTime();
        
        for (const [key, pendingMessage] of this.pendingMessages.entries()) {
          const pendingTime = new Date(pendingMessage.sentAt).getTime();
          const timeDiff = Math.abs(sentAtTime - pendingTime);
          
          // 내용이 같고 시간 차이가 5초 이내인 경우 중복으로 간주
          if (
            pendingMessage.content === chatMessage.content &&
            chatMessage.senderId === pendingMessage.senderId &&
            timeDiff < 5000
          ) {
            console.log('[WebSocket] 중복 메시지 감지, 임시 메시지 교체:', key);
            // 서버에서 받은 메시지로 임시 메시지 교체
            this.pendingMessages.delete(key);
            
            // 임시 메시지 제거 후 서버 메시지 추가
            const store = useChatStore.getState();
            const currentMessages = store.messages[roomId] || [];
            // 음수 ID(임시 메시지) 제거
            const filteredMessages = currentMessages.filter(
              (msg) => msg.id !== pendingMessage.id
            );
            // 서버 메시지 추가 (중복 체크)
            const isDuplicate = filteredMessages.some((msg) => 
              msg.id === chatMessage.id || 
              (msg.content === chatMessage.content && 
               msg.senderId === chatMessage.senderId &&
               Math.abs(new Date(msg.sentAt).getTime() - sentAtTime) < 5000)
            );
            
            if (!isDuplicate) {
              store.setMessages(roomId, [...filteredMessages, chatMessage]);
              console.log('[WebSocket] 임시 메시지 교체 완료');
            } else {
              console.log('[WebSocket] 중복 메시지 감지, 교체하지 않음');
              // 중복이어도 임시 메시지는 제거하고 서버 메시지 유지
              store.setMessages(roomId, filteredMessages);
            }
            foundPending = true;
            break;
          }
        }
        
        if (!foundPending) {
          console.log('[WebSocket] 새로운 메시지 추가');
          
          // 중복 메시지 체크: 같은 senderId와 같은 내용의 메시지가 이미 있는지 확인
          const store = useChatStore.getState();
          const currentMessages = store.messages[roomId] || [];
          
          // 같은 senderId, 같은 내용, 같은 시간(5초 이내)인 메시지가 있는지 확인
          const isDuplicate = currentMessages.some((msg) => {
            const msgTime = new Date(msg.sentAt).getTime();
            const newMsgTime = new Date(chatMessage.sentAt).getTime();
            const timeDiff = Math.abs(newMsgTime - msgTime);
            
            return (
              msg.senderId === chatMessage.senderId &&
              msg.content === chatMessage.content &&
              msg.chatRoomId === chatMessage.chatRoomId &&
              timeDiff < 5000
            );
          });
          
          if (!isDuplicate) {
            // 중복이 아닌 경우에만 메시지 추가
            this.messageHandlers.forEach((handler) => handler(chatMessage));
            useChatStore.getState().addMessage(roomId, chatMessage);
          } else {
            console.log('[WebSocket] 중복 메시지 감지, 추가하지 않음:', chatMessage);
          }
        }
      } catch (error) {
        console.error('[WebSocket] 메시지 파싱 실패:', error, message.body);
      }
    });

    console.log(`[WebSocket] 구독 완료: ${destination}`);
  }

  private sendJoinNotification(roomId: number): void {
    if (!this.client?.connected) {
      console.error('[WebSocket] STOMP 클라이언트가 연결되지 않았습니다.');
      return;
    }

    // 사용자 정보 확인
    if (!this.profileInfo) {
      console.error('[WebSocket] 사용자 정보를 찾을 수 없습니다.');
      return;
    }

    // 입장 알림 전송: /app/chat/{chatRoomId}/join
    const destination = `/app/chat/${roomId}/join`;
    const enterMessage = {};

    this.client.publish({
      destination,
      body: JSON.stringify(enterMessage),
    });

    console.log(`[WebSocket] 입장 알림 전송: ${destination}`, enterMessage);
  }

  private sendLeaveNotification(roomId: number): void {
    if (!this.client?.connected) {
      return;
    }

    // 사용자 정보 확인
    if (!this.profileInfo) {
      return;
    }

    // 퇴장 알림 전송: /app/chat/{chatRoomId}/leave
    const destination = `/app/chat/${roomId}/leave`;
    const leaveMessage = {};

    this.client.publish({
      destination,
      body: JSON.stringify(leaveMessage),
    });

    console.log(`[WebSocket] 퇴장 알림 전송: ${destination}`, leaveMessage);
  }

  private attemptReconnect(roomId: number): void {
    // 수동 연결 해제이거나 치명적 오류인 경우 재연결 시도하지 않음
    if (this.isManualDisconnect) {
      console.log('[WebSocket] 수동 연결 해제로 인해 재연결을 시도하지 않습니다.');
      return;
    }

    if (this.hasFatalError) {
      console.error('[WebSocket] 치명적 오류로 인해 재연결을 시도하지 않습니다.');
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] 최대 재연결 시도 횟수에 도달했습니다.');
      return;
    }

    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      // 재연결 시도 전에 다시 한 번 확인
      if (this.isManualDisconnect || this.hasFatalError) {
        console.log('[WebSocket] 재연결 시도 중 연결 해제 또는 치명적 오류 감지, 재연결 취소');
        return;
      }
      console.log(`[WebSocket] 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect(roomId);
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * WebSocket 연결 해제
   * @param shouldSendLeave - true일 경우 퇴장 메시지 전송 (소모임 탈퇴 시에만 사용), 기본값 false
   */
  disconnect(shouldSendLeave: boolean = false): void {
    // 수동 연결 해제 플래그 설정 (재연결 방지)
    this.isManualDisconnect = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // 퇴장 알림 전송 (소모임 탈퇴 시에만)
    if (shouldSendLeave && this.roomId && this.client?.connected) {
      this.sendLeaveNotification(this.roomId);
    }

    // 구독 해제
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    // STOMP 클라이언트 비활성화
    if (this.client) {
      if (this.client.connected) {
        this.client.deactivate();
      }
      this.client = null;
    }

    // 토큰 변경 이벤트 리스너 제거
    if (typeof window !== 'undefined' && this.tokenChangeHandler) {
      window.removeEventListener(TOKEN_CHANGE_EVENT, this.tokenChangeHandler);
      this.tokenChangeHandler = null;
    }

    this.roomId = null;
    this.reconnectAttempts = 0;
    this.hasFatalError = false; // 연결 해제 시 치명적 오류 플래그도 초기화
    useChatStore.getState().setIsConnected(false);
  }

  sendMessage(content: string): void {
    if (!this.client?.connected || !this.roomId) {
      console.error('[WebSocket] STOMP 클라이언트가 연결되지 않았습니다.');
      return;
    }

    // 사용자 정보 확인
    if (!this.profileInfo) {
      console.error('[WebSocket] 사용자 정보를 찾을 수 없습니다.');
      return;
    }

    // 사용자 ID는 surveyBasicInfo의 userId 또는 임시로 토큰에서 추출
    // 일단 userId가 없으면 0으로 설정 (서버에서 처리)
    const userId = this.profileInfo.surveyBasicInfo?.userId || 0;

    // Optimistic Update: 즉시 UI에 표시할 임시 메시지 생성
    const now = new Date().toISOString();
    const tempMessage: ChatMessage = {
      id: Date.now() * -1, // 임시 ID (음수)
      chatRoomId: this.roomId,
      senderId: userId,
      senderName: this.profileInfo.username,
      content,
      messageType: 'TEXT',
      sentAt: now,
    };

    // 임시 메시지를 Store에 추가 (즉시 UI에 표시)
    useChatStore.getState().addMessage(this.roomId, tempMessage);

    // 중복 체크를 위한 메시지 저장 (키는 내용 기반)
    const messageKey = `${content}-${userId}-${now}`;
    this.pendingMessages.set(messageKey, tempMessage);

    // 서버로 메시지 전송: /app/chat/{chatRoomId}
    // 순서: 5. 메시지 전송
    const destination = `/app/chat/${this.roomId}`;
    // 서버 요구사항에 맞게 content만 전송
    const messagePayload = {
      content,
    };
    
    this.client.publish({
      destination,
      body: JSON.stringify(messagePayload),
    });

    console.log(`[WebSocket] 메시지 전송: ${destination}`, messagePayload);
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
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

  getRoomId(): number | null {
    return this.roomId;
  }

  /**
   * WebSocket 에러 메시지 추출
   */
  private getErrorMessage(error: Event | string): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof ErrorEvent) {
      return error.message || '알 수 없는 WebSocket 오류';
    }
    
    // CORS 오류 감지
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      if (apiBaseUrl && !apiBaseUrl.includes(currentOrigin)) {
        return 'CORS 오류: 다른 도메인에서 WebSocket 연결을 시도하고 있습니다. 서버의 CORS 설정을 확인하세요.';
      }
    }
    
    return 'WebSocket 연결 오류가 발생했습니다. 네트워크 연결과 서버 상태를 확인하세요.';
  }

  /**
   * 복구 불가능한 치명적 오류인지 확인
   */
  private isFatalError(event: Event | string): boolean {
    if (typeof event === 'string') {
      const lowerError = event.toLowerCase();
      return lowerError.includes('cors') || 
             lowerError.includes('forbidden') ||
             lowerError.includes('unauthorized') ||
             lowerError.includes('cross-origin') ||
             lowerError.includes('origin');
    }

    // WebSocket 연결 오류 코드 확인
    if (event instanceof CloseEvent) {
      // 1002: 프로토콜 오류, 1003: 데이터 타입 오류는 치명적 오류로 간주
      return event.code === 1002 || event.code === 1003;
    }

    // ErrorEvent인 경우 메시지 확인
    if (event instanceof ErrorEvent) {
      const message = event.message?.toLowerCase() || '';
      return message.includes('cors') || 
             message.includes('cross-origin') ||
             message.includes('origin');
    }

    return false;
  }
}

// 싱글톤 인스턴스
export const chatWebSocket = new ChatWebSocket();
