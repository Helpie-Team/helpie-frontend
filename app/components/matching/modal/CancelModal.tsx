//3.2.1 신청취소
"use client";
import React from "react";
import arrow_left from '@/public/icons/arrow_left.png';
import Image from "next/image";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function CancelModal({ isOpen, onClose, onConfirm }: CancelModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onConfirm) {
      onConfirm(); // 부모 컴포넌트의 취소 로직 실행
    }
    onClose();
  };
 

  return (
    <div
      id="공유 모달 외부"
      onClick={handleBackdropClick}
      className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-[60]"
    >
      <div
        id="공유 모달 내부"
        className="w-[350px] sm:w-[500px] h-[178px] sm:h-[298px] bg-white rounded-[30px] px-7 py-8 flex flex-col gap-4 sm:gap-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex flex-col gap-5">
          <button title="뒤로 가기" onClick={onClose} className="hidden sm:flex items-start justify-start">
            <Image
              src={arrow_left}
              alt="뒤로 가기"
              width={24}
              height={24}
            />
          </button>
          <div className="w-full gap-2 flex flex-col items-center justify-center text-center">
            <h2 className="text-h2">소모임 참여 신청을 취소하시겠어요?</h2>
            <p className="text-body3 sm:text-body1-regular text-grayScale-700">신청이 취소되면 해당 모임에 참여할 수 없습니다.</p>
          </div>
        </div>

            <div className="w-full flex flex-row gap-2 sm:gap-3">
            <button
              onClick={()=>onClose()}
              className="flex-1 py-4 w-[240px] h-[53px] bg-white text-grayScale-700 text-h3-sb rounded-full border border-grayScale-600 "
            >
              참여유지
            </button>
            <button
              className="flex-1 py-4 w-[240px] h-[53px] bg-grayScale-700 text-white rounded-full text-h3-sb "
              onClick={handleCancel}
            >
              신청 취소
            </button>
          </div>
      </div>
    </div>
  );
}
