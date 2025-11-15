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

export default function ShareModal({ isOpen, onClose  }: ShareModalProps) {
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

  // const handleCopyLink = async () => {
  //   try {
  //     await navigator.clipboard.writeText(shareUrl);
  //     alert("링크가 복사되었습니다!");
  //   } catch (err) {
  //     console.error("클립보드 복사 실패:", err);
  //     alert("링크 복사에 실패했습니다. 다시 시도해주세요.");
  //   }
  // };

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
          <button onClick={onClose} className="hover:bg-gray-100 rounded-full transition-colors">
            <Image
              src={arrow_left}
              alt="뒤로 가기"
              width={24}
              height={24}
            />
          </button>
          <h2 className="text-h2 ml-1">공유하기</h2>
        </div>

        {/* 공유 아이콘 (지금은 클릭하면 아무것도 안 함, 추후 연결용) */}
        <div className="flex justify-around items-center">
          {shareOptions.map((option, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <button type="button">
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
            type="text"
            // value={shareUrl}
            readOnly
            className="flex-1 bg-transparent text-body3-regular text-grayScale-700 outline-none"
          />
          <button
            // onClick={handleCopyLink}
            className="h-[35px] px-4 bg-white border border-grayScale-200 rounded-full text-body1 flex items-center justify-center"
          >
            복사
          </button>
        </div>
      </div>
    </div>
  );
}
