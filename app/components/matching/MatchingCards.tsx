"use client";

import React, { useState } from "react";
import Image from "next/image";
import heart from "@/public/icons/heart.png";     
import noHeart from "@/public/icons/noHeart.png"; 
import noImage from "@/public/images/noImage.png"; 
import fire from "@/public/icons/fire.png";
export default function MatchingCards() {
  const [liked, setLiked] = useState<boolean[]>(Array(9).fill(false));

  return (
    <div className="w-[768px] gap-8 flex flex-col">
      <h1 className="text-h1 text-black">소모임 목록</h1>

      <div className="flex flex-row flex-wrap gap-4 ">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className="w-[180px] h-[232px] rounded-2xl flex flex-col "
          >
            <div className="relative w-full">
              <Image
                src={noImage}
                alt="이미지 없음"
                width={180}
                height={130}
                className="object-cover rounded-2xl"
              />
              {/*불 */}
              <Image 
              src={fire}
              alt="불"
              width={24}
              height={24}
              className="absolute top-2 right-2"
              />
              {/* 하트 버튼 */}
              <button
                type="button"
                aria-pressed={liked[index]}
                onClick={() =>
                  setLiked(prev => {
                    const next = [...prev];
                    next[index] = !next[index];
                    return next;
                  })
                }
                className="absolute bottom-1 right-2 w-[32px] h-[32px] z-10  flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src={liked[index] ? heart : noHeart}
                  alt="찜하기"
                  width={24}
                  height={24}
                  
                />
              </button>
            </div>

            {/* 이하 텍스트/태그 영역 */}
            <div className="flex flex-col gap-2 w-[180px] h-[60px] px-2 mt-1">
              <h3 className="text-body2 text-black">소모임 제목</h3>
              <p className="text-body3-regular text-grayScale-600">
                간단한 설명이 여기에 들어갑니다.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
