//3.2.1.2 공유하기 모달
"use client";
import React from "react";
import arrow_left from '@/public/icons/arrow_left.png';
import Image from "next/image";
import instagram from '@/public/icons/instagram.png';
import x from '@/public/icons/x.png';
import kakao from '@/public/icons/kakaoTalk.png';
import { ToastContainer, toast } from "react-toastify";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl  }: ShareModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const shareOptions = [
    { name: "카카오톡", icon: kakao, size: 56  },
    { name: "X", icon: x, size: 56},
    { name: "인스타그램", icon: instagram, size: 56},
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("링크가 복사되었습니다!");
    } catch {
      toast.warn("링크 복사에 실패했습니다. 다시 시도해주세요.");
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
        className="w-[500px] h-[298px] bg-white rounded-[30px] px-7 py-8 flex flex-col gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center">
          <button title="뒤로 가기" onClick={onClose} className="hover:bg-gray-100 rounded-full transition-colors">
            <Image
              src={arrow_left}
              alt="뒤로 가기"
              width={24}
              height={24}
            />
          </button>
          <h2 className="text-h2 ml-1">공유하기</h2>
        </div>

        {/* 공유 아이콘 */}
        <div className="flex justify-around items-center">
          {shareOptions.map((option, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <button title={option.name} type="button" onClick={handleCopyLink}>
                <Image
                  src={option.icon}
                  alt={option.name}
                  width={option.size}
                  height={option.size}
                  className="object-contain"
                />
              </button>
              <span className="text-body3 text-black">{option.name}</span>
            </div>
          ))}
        </div>

        {/* 링크 복사 */}
        <div className="flex items-center justify-center gap-2.5 bg-[#FAF8F7] rounded-xl p-3">
          <input
            title="링크"
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-transparent text-body3-regular text-grayScale-700 outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="h-[35px] px-4 bg-white border border-grayScale-200 rounded-full text-body1 flex items-center justify-center"
          >
            복사
          </button>
        </div>
      </div>
     
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastClassName="custom-toast"
            />
    </div>
  );
}
