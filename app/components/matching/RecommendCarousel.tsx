"use client";

import React, { useState } from "react";
import Image from "next/image";
import heart from "@/public/icons/heart.png";
import noHeart from "@/public/icons/noHeart.png";
import noImage from "@/public/images/noImage.png";

// MatchingCards의 데이터 재사용
const meetingData = [
  { dday: 3, category: "서양 / 요리", categoryColor: "bg-[#7BAF6E]", location: "서울", participants: "15명", title: "창경궁 여행 같이 가요~!", description: "고궁의 멋과 추억을, 편한 한복으로 안전히 시간 ~" },
  { dday: 5, category: "예술 / 취미", categoryColor: "bg-[#F5A623]", location: "서울", participants: "6명", title: "원데이 한식 쿠킹 클래스🍳", description: "맛있는 K-FOOD 만들고 함께 식사..." },
  { dday: 10, category: "사회 / 교류", categoryColor: "bg-[#7BAF6E]", location: "서울", participants: "10명", title: "GRWM 서류 같이 준비해요!", description: "복잡한 행정서류, 같이 하면 쉬워져..." },
  { dday: 14, category: "역사/문화", categoryColor: "bg-[#9B6FCC]", location: "서울", participants: "7명", title: "Korean Pottery Class;)", description: "한국의 아름다운 노릇을 보는 나만의 그릇을 만들어 가십니" },
  { dday: 3, category: "게임 / 오락", categoryColor: "bg-[#4A90E2]", location: "서울", participants: "8명", title: "MARVEL DAY 🦸", description: "마블은 각 히어로에서 대를 열영 안 받으~" },
  { dday: 20, category: "사회 / 교류", categoryColor: "bg-[#7BAF6E]", location: "서울", participants: "15명", title: "FIFA 월드컵 다함께보기 ⚽", description: "각자 응원하는 팀이 맞는 게임을 기억!" },
  { dday: 6, category: "자기계발 / 성장", categoryColor: "bg-[#E94B3C]", location: "서울", participants: "8명", title: "한복입고 같이 경복궁 가요~!", description: "한복입고 같이 경복궁" },
];

export default function RecommendCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<boolean[]>(Array(meetingData.length).fill(false));

  // 한 번에 보여줄 카드 개수
  const cardsPerView = 5;
  const maxIndex = meetingData.length - cardsPerView;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-h1 text-black">헬피가 당신에게 추천하는 소모임</h2>

      <div className="relative">
        {/* 이전 버튼 */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-xl"
          >
            ‹
          </button>
        )}

        {/* 캐러셀 컨테이너 */}
        <div className="overflow-hidden w-full">
          <div
            className="flex gap-3 transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (231 + 12)}px)` // 231 = 카드 너비 + 12 = gap
            }}
          >
            {meetingData.map((meeting, index) => (
              <div
                key={index}
                className="w-[231px] h-[233px] flex-shrink-0 rounded-2xl flex flex-col cursor-pointer"
              >
                <div className="flex flex-col rounded-2xl border border-grayScale-100 h-full">
                <div className="relative w-full h-[135px] overflow-hidden rounded-t-2xl">
                  <Image
                    src={noImage}
                    alt="이미지 없음"
                    fill
                    className="object-cover"
                  />

                  {/* 하트 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLiked(prev => {
                        const next = [...prev];
                        next[index] = !next[index];
                        return next;
                      });
                    }}
                    className="absolute bottom-1 right-2 w-[32px] h-[32px] z-10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                  >
                    <Image
                      src={liked[index] ? heart : noHeart}
                      alt="찜하기"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>

                {/* 텍스트 영역 */}
                <div className="flex flex-col gap-3 p-3">
                  <h3 className="text-body1-sb text-black line-clamp-1">{meeting.title}</h3>
                  <p className="text-body3 text-grayScale-600 line-clamp-1">
                    {meeting.description}
                  </p>
                  <div className="flex items-center gap-1 text-caption1-b text-grayScale-600">
                    <div className={`${meeting.categoryColor} text-white px-2 py-0.75 rounded-full text-[10px]`}>
                      {meeting.category}
                    </div>
                    <span>{meeting.location}</span>
                    <span>{meeting.participants}</span>
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>

        {/* 다음 버튼 */}
        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
