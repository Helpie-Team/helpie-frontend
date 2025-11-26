'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useChatStore } from '@/app/lib/stores/chatStore';
import ChatRoomList from '@/app/components/chat/ChatRoomList';
import ChatRoom from '@/app/components/chat/ChatRoom';
import EmptyChatState from '@/app/components/chat/EmptyChatState';

export default function ChatPage() {
  const pathname = usePathname();
  const { chatRooms, isLoadingRooms } = useChatStore();
  
  const [roomId, setRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (pathname) {
      if (pathname === '/chat') {
        setRoomId(null);
      } else if (pathname.startsWith('/chat/')) {
        const segments = pathname.split('/');
        const roomIdSegment = segments[segments.length - 1];
        const parsed = Number(roomIdSegment);
        if (!isNaN(parsed) && parsed > 0) {
          setRoomId(parsed);
        } else {
          setRoomId(null);
        }
      } else {
        setRoomId(null);
      }
    }
  }, [pathname]);

  return (
    <div className="flex h-[755px] px-[14rem] translate-y-[10rem] bg-white flex-row gap-4 justify-center  ">
      <div className={`w-[270px] border border-gray-200 flex flex-col bg-white rounded-[0.8rem] ${!isLoadingRooms && chatRooms.length === 0 ? 'hidden' : ''}`}>
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-4 text-center text-gray-500">로딩 중...</div>}>
            <ChatRoomList />
          </Suspense>
        </div>
      </div>

      <div className={`flex bg-gray-50 ${!isLoadingRooms && chatRooms.length === 0 ? 'w-full ' : 'w-[672px]'} justify-center rounded-[0.8rem] border-[0.1px] border-gray-200`}>
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          </div>
        }>
          {roomId ? (
            <ChatRoom key={roomId} />
          ) : (
            <EmptyChatState hasNoRooms={!isLoadingRooms && chatRooms.length === 0} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
