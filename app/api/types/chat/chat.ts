export interface ChatRoom {
  id: number;
  groupId: number;
  title: string;
  currentParticipants: number;
  totalMembers: number;
  isActive: boolean;
  createdAt: string;
  profileImageUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
}

export interface ChatRoomDetail {
  id: number;
  groupId: number;
  title: string;
  currentParticipants: number;
  totalMembers: number;
  isActive: boolean;
  createdAt: string;
  groupTitle?: string;
  profileImageUrl?: string;
  location?: string;
  category?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
}

export interface ChatMessage {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderProfileImage?: string;
  content: string;
  messageType: 'TEXT' | 'SYSTEM' | 'IMAGE' | 'FILE';
  sentAt: string;
}

export interface ChatMessageRequest {
  userId: number;
  userName: string;
  content: string;
}

export interface ChatMessageResponse {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderProfileImage?: string;
  content: string;
  messageType: 'TEXT' | 'SYSTEM' | 'IMAGE' | 'FILE';
  sentAt: string;
}

export interface ChatMessagesPageResponse {
  content: ChatMessage[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

