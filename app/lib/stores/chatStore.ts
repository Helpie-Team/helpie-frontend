import { create } from 'zustand';
import { ChatRoom, ChatMessage } from '@/app/api/types/chat/chat';

interface ChatState {
  // 채팅방 목록
  chatRooms: ChatRoom[];
  setChatRooms: (rooms: ChatRoom[]) => void;
  addChatRoom: (room: ChatRoom) => void;
  updateChatRoom: (roomId: number, updates: Partial<ChatRoom>) => void;

  // 현재 채팅방
  currentRoomId: number | null;
  setCurrentRoomId: (roomId: number | null) => void;

  // 메시지
  messages: Record<number, ChatMessage[]>; // roomId -> messages
  addMessage: (roomId: number, message: ChatMessage) => void;
  setMessages: (roomId: number, messages: ChatMessage[]) => void;
  prependMessages: (roomId: number, messages: ChatMessage[]) => void;
  clearMessages: (roomId: number) => void;

  // WebSocket 연결 상태
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;

  // 로딩 상태
  isLoadingRooms: boolean;
  setIsLoadingRooms: (loading: boolean) => void;
  isLoadingMessages: Record<number, boolean>;
  setIsLoadingMessages: (roomId: number, loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // 채팅방 목록
  chatRooms: [],
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  addChatRoom: (room) =>
    set((state) => ({
      chatRooms: [...state.chatRooms, room],
    })),
  updateChatRoom: (roomId, updates) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((room) =>
        room.id === roomId ? { ...room, ...updates } : room,
      ),
    })),

  // 현재 채팅방
  currentRoomId: null,
  setCurrentRoomId: (roomId) => set({ currentRoomId: roomId }),

  // 메시지
  messages: {},
  addMessage: (roomId, message) =>
    set((state) => {
      const currentMessages = state.messages[roomId] || [];
      // 중복 체크: 같은 ID나 같은 내용+시간의 메시지가 있으면 추가하지 않음
      const isDuplicate = currentMessages.some((msg) => {
        if (msg.id === message.id && msg.id > 0) return true; // 같은 양수 ID
        // 같은 내용, 같은 senderId, 5초 이내
        const msgTime = new Date(msg.sentAt).getTime();
        const newMsgTime = new Date(message.sentAt).getTime();
        const timeDiff = Math.abs(newMsgTime - msgTime);
        return (
          msg.content === message.content &&
          msg.senderId === message.senderId &&
          msg.chatRoomId === message.chatRoomId &&
          timeDiff < 5000
        );
      });
      
      if (isDuplicate) {
        console.log('[ChatStore] 중복 메시지 감지, 추가하지 않음:', message);
        return state; // 상태 변경 없음
      }
      
      return {
        messages: {
          ...state.messages,
          [roomId]: [...currentMessages, message],
        },
      };
    }),
  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages,
      },
    })),
  prependMessages: (roomId, newMessages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...newMessages, ...(state.messages[roomId] || [])],
      },
    })),
  clearMessages: (roomId) =>
    set((state) => {
      const newMessages = { ...state.messages };
      delete newMessages[roomId];
      return { messages: newMessages };
    }),

  // WebSocket 연결 상태
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),

  // 로딩 상태
  isLoadingRooms: false,
  setIsLoadingRooms: (loading) => set({ isLoadingRooms: loading }),
  isLoadingMessages: {},
  setIsLoadingMessages: (roomId, loading) =>
    set((state) => ({
      isLoadingMessages: {
        ...state.isLoadingMessages,
        [roomId]: loading,
      },
    })),
}));

