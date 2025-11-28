'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ChatRoomList from '@/app/components/chat/ChatRoomList';
import ChatRoom from '@/app/components/chat/ChatRoom';
import EmptyChatState from '@/app/components/chat/EmptyChatState';

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params?.roomId ? Number(params.roomId) : null;

  return (
    <div className="flex h-[calc(100vh-80px)] sm:h-[755px] px-0 sm:px-[14rem] translate-y-0 sm:translate-y-[10rem] bg-white flex-row gap-4 justify-center">
      {/* 채팅방 목록 - 모바일에서는 숨김, 데스크톱에서는 사이드바 */}
      <div className="hidden sm:flex w-[270px] border border-gray-200 flex-col bg-white rounded-[0.8rem]">
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-4 text-center text-gray-500">로딩 중...</div>}>
            <ChatRoomList />
          </Suspense>
        </div>
      </div>

      {/* 채팅방 - 모바일에서는 전체 화면, 데스크톱에서는 메인 영역 */}
      <div className="flex flex-col bg-gray-50 w-full sm:w-[672px] h-full justify-center rounded-0 sm:rounded-[0.8rem] border-0 sm:border-[1px] border-gray-200 overflow-hidden">
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
            <EmptyChatState hasNoRooms={true} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
