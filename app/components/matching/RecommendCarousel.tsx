"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import heart from "@/public/icons/heart.png";
import noHeart from "@/public/icons/noHeart.png";
import noImage from "@/public/images/noImage.png";
import { useRecommendedGroups } from "@/app/hooks/matching/useMatching";
import { GroupCategory } from "@/app/api/types/matching/matching";

// 카테고리별 색상 매핑
const categoryColors: Record<GroupCategory, string> = {
  'ALL': 'bg-grayScale-500',
  'HOBBY': 'bg-[#7BAF6E]',
  'ART': 'bg-[#F5A623]',
  'LIFE': 'bg-[#9B6FCC]',
  'STUDY': 'bg-[#E94B3C]',
  'SOCIAL': 'bg-[#4A90E2]',
};

// 카테고리 한글 표시
const categoryDisplayNames: Record<GroupCategory, string> = {
  'ALL': '전체',
  'HOBBY': '문화·취미',
  'ART': '예술·창작',
  'LIFE': '액티비티·라이프',
  'STUDY': '자기계발·성장',
  'SOCIAL': '사회·교류',
};

export default function RecommendCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: recommendData } = useRecommendedGroups(0);
  const [likedGroups, setLikedGroups] = useState<Set<number>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 클라이언트에서만 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const meetingData = recommendData?.page?.content || [];

  // 한 번에 보여줄 카드 개수
  const cardsPerView = 5;
  const maxIndex = Math.max(0, meetingData.length - cardsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleLikeClick = (groupId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    setLikedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // D-day 계산 함수
  const calculateDday = (meetingDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meeting = new Date(meetingDate);
    meeting.setHours(0, 0, 0, 0);
    const diffTime = meeting.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 잠김 상태 (프로필 미완성)
  if (recommendData?.isLocked) {
    return (
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-h1 text-black">헬피가 당신에게 추천하는 소모임</h2>

        <div className="relative w-full h-[260px] bg-grayScale-50 rounded-2xl flex flex-col items-center justify-center gap-4">
          {/* 자물쇠 아이콘 */}
          <div className="text-6xl">🔒</div>

          {/* 안내 메시지 */}
          <p className="text-body1 text-grayScale-600 text-center">
            {recommendData.reason || "지금 프로필을 완성하고, 나만을 위한 소모임 추천을 받아보세요✨"}
          </p>

          {/* 프로필 작성 버튼 */}
          <button
            onClick={() => window.location.href = '/profile/survey'}
            className="bg-primary text-white px-6 py-3 rounded-full text-body1-sb hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            프로필 작성하러 가기 →
          </button>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (meetingData.length === 0) {
    return (
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-h1 text-black">헬피가 당신에게 추천하는 소모임</h2>
        <div className="w-full h-[260px] flex items-center justify-center">
          <p className="text-body1-regular text-grayScale-500">추천할 소모임이 없습니다</p>
        </div>
      </div>
    );
  }

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
            {meetingData.map((meeting) => {
              const dday = calculateDday(meeting.meetingDate);
              const categoryColor = categoryColors[meeting.category];
              const categoryDisplay = categoryDisplayNames[meeting.category];

              return (
                <div
                  key={meeting.id}
                  className="w-[231px] h-[233px] flex-shrink-0 rounded-2xl flex flex-col cursor-pointer"
                >
                  <div className="flex flex-col rounded-2xl border border-grayScale-100 h-full">
                    <div className="relative w-full h-[135px] overflow-hidden rounded-t-2xl">
                      <Image
                        src={meeting.thumbnail || noImage}
                        alt={meeting.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 220px"
                        className="object-cover"
                      />

                      {/* D-day 배지 */}
                      <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-caption1 font-semibold">
                        D-{dday}
                      </div>

                      {/* 하트 버튼 (로그인 상태에서만 표시) */}
                      {isLoggedIn && (
                        <button
                          onClick={(e) => handleLikeClick(meeting.id, e)}
                          className="absolute bottom-1 right-2 w-[32px] h-[32px] z-10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                        >
                          <Image
                            src={likedGroups.has(meeting.id) ? heart : noHeart}
                            alt="찜하기"
                            width={24}
                            height={24}
                          />
                        </button>
                      )}
                    </div>

                    {/* 텍스트 영역 */}
                    <div className="flex flex-col gap-3 p-3">
                      <h3 className="text-body1-sb text-black line-clamp-1">{meeting.title}</h3>
                      <p className="text-body3 text-grayScale-600 line-clamp-1">
                        {meeting.description}
                      </p>
                      <div className="flex items-center gap-1 text-caption1-b text-grayScale-600">
                        <div className={`${categoryColor} text-white px-2 py-0.75 rounded-full text-[10px] whitespace-nowrap`}>
                          {categoryDisplay}
                        </div>
                        <span className="whitespace-nowrap">{meeting.cityName}</span>
                        <span className="whitespace-nowrap">{meeting.maxMember}명</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 다음 버튼 */}
        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-xl"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
