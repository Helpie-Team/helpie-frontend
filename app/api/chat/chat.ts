import apiClient from '../axios/instance';
import {
  ChatRoom,
  ChatRoomDetail,
  ChatMessageRequest,
  ChatMessageResponse,
  ChatMessagesPageResponse,
} from '../types/chat/chat';

/**
 * 접근 가능한 채팅방 목록 조회
 */
export async function getAccessibleChatRooms(): Promise<ChatRoom[]> {
  const response = await apiClient.get<ChatRoom[]>('/chatrooms/accessible');
  return response.data;
}

/**
 * 채팅방 상세 정보 조회
 */
export async function getChatRoomDetail(chatRoomId: number): Promise<ChatRoomDetail> {
  const response = await apiClient.get<ChatRoomDetail>(`/chatrooms/${chatRoomId}`);
  return response.data;
}

/**
 * 채팅방 메시지 조회 (페이징)
 */
export async function getChatRoomMessages(
  chatRoomId: number,
  page: number = 0,
  size: number = 10,
): Promise<ChatMessagesPageResponse> {
  const response = await apiClient.get<ChatMessagesPageResponse>(
    `/chatrooms/${chatRoomId}/messages`,
    {
      params: {
        page,
        size,
        sort: 'sentAt,desc',
      },
    },
  );
  return response.data;
}

/**
 * 채팅방 입장
 */
export async function enterChatRoom(
  chatRoomId: number,
  userName: string,
): Promise<ChatRoomDetail> {
  const response = await apiClient.post<ChatRoomDetail>(
    `/chatrooms/${chatRoomId}/enter?userName=${userName}`,
  );
  return response.data;
}

/**
 * 채팅방 퇴장
 */
export async function leaveChatRoom(chatRoomId: number, userName: string): Promise<void> {
  await apiClient.post(`/chatrooms/${chatRoomId}/leave`, null, {
    params: {
      userName,
    },
  });
}

/**
 * 메시지 전송 (REST API)
 */
export async function sendChatMessage(
  chatRoomId: number,
  message: ChatMessageRequest,
): Promise<ChatMessageResponse> {
  const response = await apiClient.post<ChatMessageResponse>(
    `/chatrooms/${chatRoomId}/messages`,
    message,
  );
  return response.data;
}

