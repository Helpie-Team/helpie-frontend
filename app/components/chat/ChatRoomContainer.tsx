'use client';

import React, { Suspense } from 'react';
import { useParams, usePathname } from 'next/navigation';
import ChatRoom from './ChatRoom';
import EmptyChatState from './EmptyChatState';

export default function ChatRoomContainer() {
  const params = useParams();
  const pathname = usePathname();
  
  // URL 경로에서 roomId 추출
  // /chat/23 -> roomId = 23
  // /chat -> roomId = null
  let roomId: number | null = null;
  
  if (params?.roomId) {
    // 동적 라우트에서 가져오기
    roomId = Number(params.roomId);
  } else if (pathname && pathname.startsWith('/chat/')) {
    // 경로에서 직접 추출 (fallback)
    const segments = pathname.split('/');
    const roomIdSegment = segments[segments.length - 1];
    const parsed = Number(roomIdSegment);
    if (!isNaN(parsed) && parsed > 0) {
      roomId = parsed;
    }
  }

  if (!roomId) {
    return <EmptyChatState />;
  }

  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">채팅방을 불러오는 중...</p>
        </div>
      </div>
    }>
      <ChatRoom />
    </Suspense>
  );
}
