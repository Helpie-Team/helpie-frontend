'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import HelpieChatImage from '@/public/images/helpie-chat.png';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface EmptyChatStateProps {
  hasNoRooms?: boolean;
}

export default function EmptyChatState({ hasNoRooms = false }: EmptyChatStateProps) {
  const router = useRouter();

  const handleGoToMatching = () => {
    router.push('/matching');
  };

  if (hasNoRooms) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center flex flex-col items-center">
          {/* 일러스트 이미지 */}
          <div className="mb-6">
            <Image src={HelpieChatImage} alt="소모임 참여하기" width={200} height={200} />
          </div>
          
          {/* 안내 텍스트 */}
          <p className="text-gray-700 text-lg mb-8">
            소모임에 가입해서 채팅에 참여해보세요!
          </p>
          
          {/* 소모임 참여하러 가기 버튼 */}
          <button
            onClick={handleGoToMatching}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
          >
            <span>소모임 참여하러 가기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-full bg-gray-50">
      <div className="text-center">
        {/* 이미지 */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <Image src={HelpieChatImage} alt="Helpie Chat" width={100} height={100} />
        </div>
        <p className="text-gray-600 text-lg mb-2">채팅방을 선택해주세요</p>
      </div>
    </div>
  );
}
