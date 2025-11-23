'use client';

import React, { useEffect } from 'react';
import { useChatStore } from '@/app/lib/stores/chatStore';
import { getAccessibleChatRooms } from '@/app/api/chat/chat';
import ChatRoomItem from './ChatRoomItem';
import EmptyChatState from './EmptyChatState';

export default function ChatRoomList() {
  const { chatRooms, isLoadingRooms, setChatRooms, setIsLoadingRooms } = useChatStore();

  useEffect(() => {
    const fetchChatRooms = async () => {
      setIsLoadingRooms(true);
      try {
        const rooms = await getAccessibleChatRooms();
        setChatRooms(rooms);
      } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
        setChatRooms([]);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchChatRooms();
  }, [setChatRooms, setIsLoadingRooms]);

  if (isLoadingRooms) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">채팅방 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-500 p-8">
        <EmptyChatState />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {chatRooms.map((room) => (
        <ChatRoomItem key={room.id} room={room} />
      ))}
    </div>
  );
}

