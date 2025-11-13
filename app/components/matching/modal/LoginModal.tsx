import React from 'react';
import arrow_left from '@/public/icons/arrow_left.png';
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface JoinConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function LoginModal({isOpen, onClose, onConfirm}: JoinConfirmProps) {
  const router = useRouter();
   if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  const handleConfirm = () => {
    router.push('/login'); // 로그인 페이지로 이동
  };
    return (
      <div
        id="모달 외부"
        onClick={handleBackdropClick}
        className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50"
      >
        <div
          id="모달 내부"
          className="w-[540px] h-[245px] bg-white rounded-[30px] px-6 py-8 flex flex-col gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 - 뒤로가기 버튼 */}
          <div className="flex items-start justify-start w-full">
            <button onClick={onClose}>
              <Image
                src={arrow_left}
                alt="뒤로 가기"
                width={30}
                height={30}
              />
            </button>
          </div>
          <h1 className="text-h1 text-center">회원가입/로그인 하시겠습니까?</h1>
            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-key-100 text-white rounded-full text-h3-sb gap-3 flex justify-center items-center"
            >
              좋아요! 
            </button>
        </div>
      </div>
    );
  }
