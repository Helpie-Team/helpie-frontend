//3.2.1.2 공유하기 모달
"use client";
import React from "react";
import arrow_left from '@/public/icons/arrow_left.png';
import Image from "next/image";
import instagram from '@/public/icons/instagram.png';
import x from '@/public/icons/x.png';
import kakao from '@/public/icons/kakaoTalk.png';
import blog from '@/public/icons/blog.png';
import whatsapp from '@/public/icons/whatsApp.png';
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const shareOptions = [
    { name: "카카오톡", icon: kakao, size: 56  },
    { name: "X", icon: x, size: 56},
    { name: "블로그", icon: blog, size: 56},
    { name: "왓츠앱", icon: whatsapp, size: 56},
    { name: "인스타그램", icon: instagram, size: 56},
  ];

  const handleCopyLink = () => {
    const url = "https://www.helpie.com/ 각 소모임 모달카드 공유 링크";
    navigator.clipboard.writeText(url);
    alert("링크가 복사되었습니다!");
  };

  return (
    <div
      id="공유 모달 외부"
      onClick={handleBackdropClick}
      className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-[60]"
    >
      <div
        id="공유 모달 내부"
        className="w-[500px] bg-white rounded-[30px] px-8 py-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
            <Image
              src={arrow_left}
              alt="뒤로 가기"
              width={24}
              height={24}
            />
          </button>
          <h2 className="text-h2">공유하기</h2>
        </div>

        {/* 공유 아이콘 */}
        <div className="flex justify-around items-center py-4">
          {shareOptions.map((option, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <button
                className={`w-16 h-16 rounded-full ${option.color} flex items-center justify-center text-white hover:scale-110 transition-transform overflow-hidden`}
              >
                <Image
                  src={option.icon}
                  alt={option.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </button>
              <span className="text-caption1-regular text-grayScale-700">{option.name}</span>
            </div>
          ))}
        </div>

        {/* 링크 복사 */}
        <div className="flex items-center gap-3 bg-grayScale-50 rounded-xl p-4">
          <input
            type="text"
            value="https://www.helpie.com/ 각 소모임 모달카드 공유 링크"
            readOnly
            className="flex-1 bg-transparent text-body3-regular text-grayScale-600 outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-white border border-grayScale-300 rounded-lg text-body3-medium hover:bg-grayScale-100 transition-colors"
          >
            복사
          </button>
        </div>
      </div>
    </div>
  );
}
