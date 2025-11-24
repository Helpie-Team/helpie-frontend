'use client';

import React from 'react';
import HelpieChatImage from '@/public/images/helpie-chat.png';
import Image from 'next/image';

export default function EmptyChatState() {
  return (
    <div className="flex justify-center items-center bg-gray-50">
      <div className="text-center">
        {/* 이미지와 같은 일러스트 */}
        <div className="flex justify-center items-center gap-4 mb-6">

          <Image src={HelpieChatImage} alt="Helpie Chat" width={100} height={100} />

        </div>
        <p className="text-gray-600 text-lg mb-2">채팅방을 선택해주세요</p>
      </div>
    </div>
  );
}
