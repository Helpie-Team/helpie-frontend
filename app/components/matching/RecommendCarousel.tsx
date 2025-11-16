"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import heart from "@/public/icons/heart.png";
import noHeart from "@/public/icons/noHeart.png";
import noImage from "@/public/images/noImage.png";
import seoul from "@/public/images/seoul.png";
import shanghai from "@/public/images/shanghai.png";
import tokyo from "@/public/images/tokyo.png";
import travel_image from "@/public/images/travel_image.png";
import london from "@/public/images/london.png";
import { useRecommendedGroups } from "@/app/hooks/matching/useMatching";
import { GroupCategory } from "@/app/api/types/matching/matching";
import { Lock } from "lucide-react";

// 카테고리별 색상 매핑
const categoryColors: Record<GroupCategory, string> = {
  ALL: "bg-grayScale-500",
  HOBBY: "bg-[#7BAF6E]",
  ART: "bg-[#F5A623]",
  LIFE: "bg-[#9B6FCC]",
  STUDY: "bg-[#E94B3C]",
  SOCIAL: "bg-[#4A90E2]",
};

// 카테고리 한글 표시
const categoryDisplayNames: Record<GroupCategory, string> = {
  ALL: "전체",
  HOBBY: "문화·취미",
  ART: "예술·창작",
  LIFE: "액티비티·라이프",
  STUDY: "자기계발·성장",
  SOCIAL: "사회·교류",
};

interface RecommendCarouselProps {
  forceRender?: boolean; // 잠금 상태에서도 캐러셀 렌더링 강제
}

export default function RecommendCarousel({
  forceRender = false,
}: RecommendCarouselProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: recommendData } = useRecommendedGroups(0);
  const [likedGroups, setLikedGroups] = useState<Set<number>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 클라이언트에서만 로그인 상태 확인
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  // 더미 데이터 (forceRender일 때 사용)
  const dummyImages = [seoul, shanghai, tokyo, travel_image, london];
  const dummyData = Array(5)
    .fill(null)
    .map((_, i) => ({
      id: i,
      title: "추천 소모임",
      description: "설문조사를 완료하면 맞춤 소모임을 추천해드려요",
      thumbnail: dummyImages[i] as unknown as string, // StaticImageData를 string으로 변환
      meetingDate: new Date().toISOString(),
      category: "ALL" as GroupCategory,
      cityName: "서울",
      maxMember: 5,
      isPopular: false,
      dayBefore: 30,
      status: "RECRUITING" as const,
    }));

  const meetingData =
    forceRender &&
    (!recommendData?.page?.content || recommendData.page.content.length === 0)
      ? dummyData
      : recommendData?.page?.content || [];

  // 한 번에 보여줄 카드 개수
  const cardsPerView = 4;

  // 잠김 여부 확인
  const isLocked = recommendData?.isLocked && !forceRender;

  // 잠김 상태일 때 더미 데이터 표시
  const displayData =
    isLocked || (forceRender && meetingData.length === 0)
      ? dummyData
      : meetingData;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, displayData.length - cardsPerView);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleLikeClick = (groupId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    setLikedGroups((prev) => {
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
 
  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-h1 text-black">헬피가 당신에게 추천하는 소모임</h2>

      {/* 피그마 스타일 캐러셀 컨테이너 */}
      <div className="relative mt-1 w-full h-[244px] ">
        <div className="w-full h-full rounded-[15px]  bg-white overflow-hidden">
        {/* 실제 캐러셀 영역 */}
        <div className="overflow-hidden w-full h-full">
          <div
            className={`flex gap-3 h-full items-center transition-transform duration-300 ease-in-out  ${
              isLocked ? "opacity-40 blur-[1px] pointer-events-none" : ""
            }`}
            style={{
              transform: `translateX(-${currentIndex * (231 + 12)}px)`, // 카드 너비 + gap
            }}
          >
            {displayData.map((meeting) => {
              const dday = calculateDday(meeting.meetingDate);
              const categoryColor = categoryColors[meeting.category];
              const categoryDisplay = categoryDisplayNames[meeting.category];

              return (
                <div
                  key={meeting.id}
                  className="w-[231px] h-[220px] flex-shrink-0 rounded-2xl flex flex-col cursor-pointer"
                >
                  
                  <div className="flex flex-col rounded-2xl border border-grayScale-100 h-full overflow-hidden">
                    {/* 썸네일 */}
                    <div className="relative w-full h-[135px]">
                      
                      <Image
                        src={
                          !meeting.thumbnail
                            ? noImage
                            : typeof meeting.thumbnail === "string" &&
                              meeting.thumbnail.trim() === ""
                            ? noImage
                            : meeting.thumbnail
                        }
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
                          title="찜하기"
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
                    <div className="flex flex-col gap-2 p-3">
                      <h3 className="text-body1-sb text-black line-clamp-1">
                        {meeting.title}
                      </h3>
                      <p className="text-body3 text-grayScale-600 line-clamp-1">
                        {meeting.description}
                      </p>
                      <div className="flex items-center gap-1 text-caption1-b text-grayScale-600">
                        <div
                          className={`${categoryColor} text-white px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap`}
                        >
                          {categoryDisplay}
                        </div>
                        <span className="whitespace-nowrap">
                          {meeting.cityName}
                        </span>
                        <span className="whitespace-nowrap">
                          {meeting.maxMember}명
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>

        {/* 잠금 오버레이 – 배경이 비치도록 그라데이션 */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-white/90 via-white/75 to-white/40 z-20">
            <Lock className="w-10 h-10 text-grayScale-900 stroke-[1.5]" />

            <div className="flex flex-col gap-1 text-center">
              <h3 className="text-h2 text-black">
                지금 프로필을 완성해 주세요
              </h3>
              <p className="text-body1-regular text-grayScale-600">
                프로필을 작성하면 나만을 위한 맞춤 소모임을 추천해드려요
              </p>
            </div>

            <button
              title="프로필 작성하러 가기"
              onClick={() => (window.location.href = "/new-user-info")}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF5C35] px-6 py-3 text-body1-sb text-white shadow-md hover:bg-[#FF4A1F] transition-colors"
            >
              프로필 작성하러 가기
              <span className="text-base">➜</span>
            </button>
          </div>
        )}
        </div>
           {/* 이전 버튼 */}
           {currentIndex > 0 && (
           <button
          title="이전"
          onClick={handlePrev}
          disabled={isLocked || currentIndex <= 0}
          className="absolute -left-[50px] top-1/2 -translate-y-1/2
          flex h-9 w-9 items-center justify-center
          rounded-full bg-black/5 border border-black/5 shadow-sm
          hover:bg-black/10 transition-colors"
          type="button"
        >
      <span className="text-[20px] leading-none text-black">‹</span>
        </button>
        )}
        {/* 다음 버튼 – 잠겨 있어도 보이지만 잠금 시 비활성화 느낌 */}
        <button
          title="다음"
          onClick={handleNext}
          disabled={isLocked || currentIndex >= Math.max(0, displayData.length - cardsPerView)}
          className="absolute right-[-50px] top-1/2 -translate-y-1/2
          flex h-9 w-9 items-center justify-center
          rounded-full bg-black/5 border border-black/5 shadow-sm
          hover:bg-black/10 transition-colors"
          type="button"
        >
     <span className="text-[20px] leading-none text-black">›</span>
        </button>

     
      </div>
    </div>
  );
}
