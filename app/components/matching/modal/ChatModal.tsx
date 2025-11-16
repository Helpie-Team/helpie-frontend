//3.2.2 채팅방으로 이동
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import arrow_left from '@/public/icons/arrow_left.png';
import Image from "next/image";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: number;
}

export default function ChatModal({ isOpen, onClose, roomId }: ChatModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMoveToChatRoom = () => {
    if (roomId) {
      // 채팅방 페이지로 이동
      router.push(`/chat/${roomId}`);
    } else {
      alert('채팅방 정보를 찾을 수 없습니다.');
      onClose();
    }
  };
 

  return (
    <div
      id="공유 모달 외부"
      onClick={handleBackdropClick}
      className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-[60]"
    >
      <div
        id="공유 모달 내부"
        className="w-[540px] h-[272px] bg-white rounded-[30px] px-6 py-8 flex flex-col gap-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex flex-col gap-5">
          <button title="뒤로 가기" onClick={onClose} className="flex items-start justify-start">
            <Image
              src={arrow_left}
              alt="뒤로 가기"
              width={24}
              height={24}
            />
          </button>
          <div className="w-full gap-2 flex flex-col items-center justify-center text-center">
            <h2 className="text-h1">채팅방으로 이동하시겠어요?</h2>
            <p className="text-body1-regular text-grayScale-700">새로운 대화와 연결이 기다리고 있어요🌿</p>
          </div>
        </div>

            <div className="w-full flex flex-row gap-3">
            <button
              onClick={()=>onClose()}
              className="flex-1 py-4 w-[240px] h-[53px] bg-white text-grayScale-700 text-h3-sb rounded-full border border-grayScale-600 "
            >
              취소
            </button>
            <button
              className="flex-1 py-4 w-[240px] h-[53px] bg-key-100 text-white rounded-full text-h3-sb "
              onClick={handleMoveToChatRoom}
            >
              채팅방으로 이동
            </button>
          </div>
      </div>
    </div>
  );
}
