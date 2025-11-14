"use client";

import { useState } from "react";
import MatchingFilter from '@/app/components/matching/MatchingFilter';
import MatchingCards from '@/app/components/matching/MatchingCards';
import ReviewList from '@/app/components/matching/ReviewList';
import { GroupCategory } from '@/app/api/types/matching/matching';

interface MatchingBodyProps {
  country: string;                     // 'ALL' | 'KOREA' | 'JAPAN' ... 이런 값들
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
    <div className="w-full flex flex-col gap-12">
      {/* 탭 메뉴 */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-[490px] px-5 pb-3 text-h2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "text-key-100 border-key-100"
                : "text-grayScale-600 border-grayScale-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "browse" ? (
        <div className="flex gap-6">
          {/* 🔹 검색 중이 아닐 때만 카테고리 필터 보이게 */}
          {!isSearchMode && (
            <MatchingFilter
              selectedCategory={category}
              onCategoryChange={onCategoryChange}
            />
          )}

          <div className="flex-1">
            <MatchingCards
              country={country}                      // ✅ 그대로 전달 (ALL 포함)
              category={category}                    // 검색 모드에서 쓰느냐는 MatchingCards 쪽에서 분기
              searchKeyword={searchKeyword}          // 검색어 있으면 내부에서 /public/search 쓰도록
            />
          </div>
        </div>
      ) : (
        <ReviewList />
      )}
    </div>
  );
}
