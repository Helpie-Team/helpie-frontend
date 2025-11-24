'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ChatRoomList from '@/app/components/chat/ChatRoomList';
import ChatRoom from '@/app/components/chat/ChatRoom';
import EmptyChatState from '@/app/components/chat/EmptyChatState';

export default function ChatPage() {
  const pathname = usePathname();
  
  // URL 경로에서 roomId 추출
  // /chat/23 -> roomId = 23
  // /chat -> roomId = null
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
    <div className="flex h-[755px] px-[14rem] translate-y-[10rem] bg-white flex-row gap-4 justify-center translate-y- ">
      {/* 왼쪽: 채팅방 목록 */}
      <div className="w-[270px] border border-gray-200 flex flex-col bg-white rounded-[0.8rem]">
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-4 text-center text-gray-500">로딩 중...</div>}>
            <ChatRoomList />
          </Suspense>
        </div>
      </div>

      {/* 오른쪽: 채팅방 또는 빈 상태 */}
      <div className="flex bg-gray-50 w-[672px] justify-center rounded-[0.8rem] border-[0.1px]  border-gray-200">
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
            <EmptyChatState />
          )}
        </Suspense>
      </div>
    </div>
  );
}
