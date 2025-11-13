"use client";

import { useState } from "react";
import MatchingFilter from '@/app/components/matching/MatchingFilter';
import MatchingCards from '@/app/components/matching/MatchingCards';
import ReviewList from '@/app/components/matching/ReviewList';
import { GroupCategory } from '@/app/api/types/matching/matching';

interface MatchingBodyProps {
  country: string;
  category: GroupCategory;
  onCategoryChange: (category: GroupCategory) => void;
}

export default function MatchingBody({ country, category, onCategoryChange }: MatchingBodyProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "review">("browse");

  const tabs = [
    { id: "browse" as const, label: "소모임 둘러보기" },
    { id: "review" as const, label: "참여후기" }
  ];

  return (
    <div className="w-full flex flex-col gap-12">
      {/* 탭 메뉴 */}
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-[490px] px-5 pb-3 text-h2 transition-colors border-b-2 ${
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
        <div className="flex">
          <div className="flex-shrink-0">
            <MatchingFilter
              selectedCategory={category}
              onCategoryChange={onCategoryChange}
            />
          </div>
          <div className="flex-1">
            <MatchingCards
              country={country}
              category={category}
            />
          </div>
        </div>
      ) : (
        <ReviewList />
      )}
    </div>
  );
}