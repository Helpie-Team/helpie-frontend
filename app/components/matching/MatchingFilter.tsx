'use client';

import React from 'react';
import { GroupCategory } from '@/app/api/types/matching/matching';

interface MatchingFilterProps {
  selectedCategory: GroupCategory;
  onCategoryChange: (category: GroupCategory) => void;
}

// 한글 카테고리와 API 카테고리 매핑
const categoryMap: Record<string, GroupCategory> = {
  '전체': 'ALL',
  '문화 · 취미': 'HOBBY',
  '예술 · 창작': 'ART',
  '액티비티 · 라이프': 'LIFE',
  '자기계발 · 성장': 'STUDY',
  '사회 · 교류': 'SOCIAL',
};


export default function MatchingFilter({ selectedCategory, onCategoryChange }: MatchingFilterProps) {
  const categories = [
    '전체',
    '문화 · 취미',
    '예술 · 창작',
    '액티비티 · 라이프',
    '자기계발 · 성장',
    '사회 · 교류'
  ];

  const handleCategoryClick = (categoryName: string) => {
    const apiCategory = categoryMap[categoryName];
    onCategoryChange(apiCategory);
  };

  return (
    <div className="w-full sm:w-[200px] sm:h-full sm:flex sm:flex-col sm:gap-8">
      {/* ===== 모바일: 가로 스크롤 pill ===== */}
      <div className="sm:hidden w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-3">
          {categories.map((category) => {
            const apiCategory = categoryMap[category];
            const isSelected = selectedCategory === apiCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`shrink-0 py-[10px] px-[14px] rounded-full border text-body2 transition-colors
                  ${
                    isSelected
                      ? "bg-grayScale-700  text-white border-grayScale-900"
                      : "bg-white text-black border-grayScale-200"
                  }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

    <div className="hidden sm:flex sm:flex-col sm:w-[180px] h-full sm:gap-8 items-ceter justify-start">
      {/* 카테고리 */}
      <div>
        <h2 className="hidden sm:flex text-[18px] font-semibold text-black mb-6">카테고리</h2>

        <div className="flex flex-col gap-5">
          {categories.map((category) => {
            const apiCategory = categoryMap[category];
            const isSelected = selectedCategory === apiCategory;

            return (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isSelected
                      ? 'bg-key-100'
                      : 'bg-key-300'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <span className="text-body1-regular text-grayScale-600" >
                  {category}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
}
