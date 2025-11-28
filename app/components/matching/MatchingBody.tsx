"use client";

import { useState } from "react";
import MatchingFilter from "@/app/components/matching/MatchingFilter";
import MatchingCards from "@/app/components/matching/MatchingCards";
import ReviewList from "@/app/components/matching/ReviewList";
import { GroupCategory } from "@/app/api/types/matching/matching";

interface MatchingBodyProps {
  country: string; // 'ALL' | 'KOREA' | 'JAPAN' ...
  category: GroupCategory;
  onCategoryChange: (category: GroupCategory) => void;
  searchKeyword?: string;
}

export default function MatchingBody({
  country,
  category,
  onCategoryChange,
  searchKeyword,
}: MatchingBodyProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "review">("browse");

  // 🔹 검색 중인지 여부
  const isSearchMode = !!searchKeyword && searchKeyword.trim().length > 0;

  const tabs = [
    { id: "browse" as const, label: "소모임 둘러보기" },
    { id: "review" as const, label: "참여후기" },
  ];

  return (
    <div className="w-full flex flex-col gap-4 md:gap-12">
      {/* 탭 메뉴 */}
      <div className="flex w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 md:w-[490px]
              py-5
              text-body1 md:text-h2
              border-b-2 gap-1 transition-colors
              ${
                activeTab === tab.id
                  ? "text-key-100 border-key-100"
                  : "text-grayScale-600 border-grayScale-200"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "browse" ? (
        // 모바일: 위아래, PC: 좌우
        <div className="flex flex-col md:flex-row gap-6">
          {/* 왼쪽(PC) / 위쪽(모바일) : 카테고리 필터 */}
          {!isSearchMode && (
            <div className="w-full md:w-[260px] shrink-0">
              <MatchingFilter
                selectedCategory={category}
                onCategoryChange={onCategoryChange}
              />
            </div>
          )}

          {/* 오른쪽(PC) / 아래쪽(모바일) : 카드 리스트 */}
          <div className="flex-1">
            <MatchingCards
              country={country}
              category={category}
              searchKeyword={searchKeyword}
            />
          </div>
        </div>
      ) : (
        <ReviewList />
      )}
    </div>
  );
}
