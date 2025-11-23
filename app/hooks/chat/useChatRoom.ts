'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChatStore } from '@/app/lib/stores/chatStore';
import { useMyProfileInfo } from '@/app/hooks/my-page/useMyProfileInfo';
import { getChatRoomDetail, getChatRoomMessages } from '@/app/api/chat/chat';
import { chatWebSocket } from '@/app/lib/websocket/chatWebSocket';

interface RoomInfo {
  profileImageUrl?: string;
  location?: string;
  participants?: number;
  maxParticipants?: number;
  activityType?: string;
}

export function useChatRoom() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.roomId ? Number(params.roomId) : null;
  const { data: profileInfo, isLoading: isLoadingProfile } = useMyProfileInfo();
  const {
    currentRoomId,
    setCurrentRoomId,
    messages,
    setMessages,
    prependMessages,
    isLoadingMessages,
    setIsLoadingMessages,
    isConnected,
  } = useChatStore();

  const [roomTitle, setRoomTitle] = useState<string>('');
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const isEnteringRef = useRef(false);
  const hasEnteredRef = useRef(false);
  const errorUnsubscribeRef = useRef<(() => void) | null>(null);
  const closeUnsubscribeRef = useRef<(() => void) | null>(null);
  const currentRoomIdRef = useRef<number | null>(null);
  const enteringRoomIdRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 채팅방 상세 정보 및 메시지 로드
  useEffect(() => {
    if (!roomId || isLoadingProfile || !profileInfo?.username) {
      console.log('[ChatRoom] roomId 또는 profileInfo가 없습니다:', { roomId, isLoadingProfile, profileInfo });
      return;
    }

    // 이미 같은 roomId로 입장 중이거나 입장 완료된 경우 중복 호출 방지
    if (enteringRoomIdRef.current === roomId || (currentRoomIdRef.current === roomId && hasEnteredRef.current)) {
      console.log(`[ChatRoom] 이미 입장 중이거나 입장 완료된 roomId: ${roomId}`);
      return;
    }

    let isMounted = true;
    isEnteringRef.current = true;
    hasEnteredRef.current = false;
    enteringRoomIdRef.current = roomId;

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const loadChatRoom = async () => {
      try {
        console.log(`[ChatRoom] 채팅방 로드 시작: roomId=${roomId}, username=${profileInfo.username}`);
        
        // 요청이 취소되었는지 확인
        if (abortControllerRef.current?.signal.aborted || !isMounted) {
          console.log(`[ChatRoom] 요청이 취소되었거나 컴포넌트가 언마운트됨: roomId=${roomId}`);
          return;
        }

        // 채팅방 상세 정보
        const roomDetail = await getChatRoomDetail(roomId);
        if (!isMounted) return;
        
        setRoomTitle(roomDetail.title);
        
        // 카테고리 한글 변환
        const categoryDisplayMap: Record<string, string> = {
          'ALL': '전체',
          'HOBBY': '문화 · 취미',
          'ART': '예술 · 창작',
          'LIFE': '액티비티 · 라이프',
          'STUDY': '자기계발 · 성장',
          'SOCIAL': '사회 · 교류',
        };
        
        setRoomInfo({
          profileImageUrl: roomDetail.profileImageUrl,
          location: roomDetail.location,
          participants: roomDetail.currentParticipants,
          maxParticipants: roomDetail.totalMembers,
          activityType: roomDetail.category ? categoryDisplayMap[roomDetail.category] || roomDetail.category : undefined,
        });

        // 메시지 로드
        setIsLoadingMessages(roomId, true);
        const messagesData = await getChatRoomMessages(roomId, 0, 50);
        if (!isMounted) return;
        
        setMessages(roomId, messagesData.content.reverse());
        setHasMoreMessages(!messagesData.last);
        setCurrentPage(0);

        // WebSocket에 사용자 정보 설정
        chatWebSocket.setProfileInfo(profileInfo);
        
        // WebSocket 연결
        chatWebSocket.connect(roomId);
        setCurrentRoomId(roomId);
        currentRoomIdRef.current = roomId;
        
        // 입장 완료
        if (isMounted && !abortControllerRef.current?.signal.aborted) {
          isEnteringRef.current = false;
          hasEnteredRef.current = true;
          enteringRoomIdRef.current = null;
        }
        
        // WebSocket 에러 핸들러 등록
        errorUnsubscribeRef.current = chatWebSocket.onError((error) => {
          const errorMessage = typeof error === 'string' ? error : 'WebSocket 연결에 실패했습니다.';
          setConnectionError(errorMessage);
          console.error('[ChatRoom] WebSocket 에러:', error);
        });
        
        // WebSocket 종료 핸들러 등록
        closeUnsubscribeRef.current = chatWebSocket.onClose(() => {
          if (!chatWebSocket.isConnected()) {
            setConnectionError('연결이 끊어졌습니다. 재연결을 시도합니다...');
          }
        });
      } catch (error) {
        // AbortError는 정상적인 취소이므로 무시
        if (error instanceof Error && error.name === 'AbortError') {
          console.log(`[ChatRoom] 요청 취소됨: roomId=${roomId}`);
          return;
        }
        
        console.error('[ChatRoom] 채팅방 로드 실패:', error);
        if (isMounted && !abortControllerRef.current?.signal.aborted) {
          isEnteringRef.current = false;
          enteringRoomIdRef.current = null;
          router.push('/chat');
          setRoomInfo({});
        }
      } finally {
        if (isMounted && !abortControllerRef.current?.signal.aborted) {
          setIsLoadingMessages(roomId, false);
        }
      }
    };

    loadChatRoom();

    return () => {
      isMounted = false;
      
      // 진행 중인 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      // 핸들러 정리
      if (errorUnsubscribeRef.current) {
        errorUnsubscribeRef.current();
        errorUnsubscribeRef.current = null;
      }
      if (closeUnsubscribeRef.current) {
        closeUnsubscribeRef.current();
        closeUnsubscribeRef.current = null;
      }
      
      // WebSocket 연결 해제 (채팅방 이동 시에는 퇴장 메시지 전송하지 않음)
      // 소모임 탈퇴 시에는 별도로 disconnect(true) 호출 필요
      if (chatWebSocket.getRoomId() === roomId) {
        chatWebSocket.disconnect(false); // 퇴장 메시지 전송하지 않음
      }
      
      // 상태 초기화
      if (currentRoomIdRef.current === roomId) {
        currentRoomIdRef.current = null;
        setCurrentRoomId(null);
      }
      if (enteringRoomIdRef.current === roomId) {
        enteringRoomIdRef.current = null;
      }
      isEnteringRef.current = false;
      hasEnteredRef.current = false;
    };
  }, [roomId, profileInfo, isLoadingProfile, setMessages, setIsLoadingMessages, setCurrentRoomId, router]);

  // 연결 상태 변경 시 에러 메시지 초기화
  useEffect(() => {
    if (isConnected) {
      setConnectionError(null);
    }
  }, [isConnected]);



  // 이전 메시지 로드 (무한 스크롤)
  const loadMoreMessages = async () => {
    if (!roomId || isLoadingRef.current || !hasMoreMessages) return;

    isLoadingRef.current = true;
    try {
      const nextPage = currentPage + 1;
      const messagesData = await getChatRoomMessages(roomId, nextPage, 50);
      prependMessages(roomId, messagesData.content.reverse());
      setHasMoreMessages(!messagesData.last);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      isLoadingRef.current = false;
    }
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (!messagesContainerRef.current || isLoadingRef.current) return;

    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0 && hasMoreMessages) {
      loadMoreMessages();
    }
  };

  // 메시지 전송
  const handleSendMessage = async (content: string) => {
    if (!roomId || !profileInfo?.username || !content.trim()) return;

    try {
      if (chatWebSocket.isConnected()) {
        chatWebSocket.sendMessage(content);
      } else {
        setConnectionError('메시지를 보낼 수 없습니다. 연결을 확인하고 재시도해주세요.');
        if (roomId) {
          chatWebSocket.connect(roomId);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const roomMessages = roomId ? messages[roomId] || [] : [];
  const isLoading = roomId ? isLoadingMessages[roomId] || false : false;

  return {
    roomId,
    roomTitle,
    roomInfo,
    roomMessages,
    isLoading,
    connectionError,
    isConnected,
    messagesEndRef,
    messagesContainerRef,
    handleScroll,
    loadMoreMessages,
    handleSendMessage,
    setConnectionError,
    hasMoreMessages,
  };
}

