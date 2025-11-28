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
      <div className="flex justify-center items-center h-full px-4">
        <div className="text-center flex flex-col items-center max-w-md">
          {/* 일러스트 이미지 */}
          <div className="mb-4 sm:mb-6">
            <Image src={HelpieChatImage} alt="소모임 참여하기" width={200} height={200} className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]" />
          </div>
          
          {/* 안내 텍스트 */}
          <p className="text-gray-700 text-base sm:text-lg mb-6 sm:mb-8">
            소모임에 가입해서 채팅에 참여해보세요!
          </p>
          
          {/* 소모임 참여하러 가기 버튼 */}
          <button
            onClick={handleGoToMatching}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors text-sm sm:text-base"
          >
            <span>소모임 참여하러 가기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-full bg-gray-50 px-4">
      <div className="text-center">
        {/* 이미지 */}
        <div className="flex justify-center items-center gap-4 mb-4 sm:mb-6">
          <Image src={HelpieChatImage} alt="Helpie Chat" width={100} height={100} className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]" />
        </div>
        <p className="text-gray-600 text-base sm:text-lg mb-2">채팅방을 선택해주세요</p>
      </div>
    </div>
  );
}
