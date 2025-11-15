'use client';

import React, { useState, useEffect } from 'react';
import MatchingBar from '@/app/components/matching/MatchingBar';
import MatchingBody from '@/app/components/matching/MatchingBody';
import ImageSwiper from '@/app/components/matching/ImageSwiper';
import RecommendCarousel from '@/app/components/matching/RecommendCarousel';
import { GroupCategory } from '@/app/api/types/matching/matching';

export default function Page() {
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState<GroupCategory>("ALL");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 클라이언트에서만 로그인 상태 확인
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    // 검색 시 카테고리 초기화
    setSelectedCategory("ALL");
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
  };

  return (
    <div className="flex flex-col items-center gap-8 pb-20">
      <MatchingBar
        onCountrySelect={(code) => {
          setSelectedCountry(code);
        }}
        onSearch={handleSearch}
      />
      {/* 검색 모드가 아닐 때만 표시 */}
      {!searchKeyword && isLoggedIn && (
        <div className="w-[1000px] relative">
          <RecommendCarousel />
        </div>
      )}
      {!searchKeyword && <ImageSwiper />}

      <div className="w-[1000px]">
        {searchKeyword ? (
          /* 검색 모드 */
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h2">
                &quot;{searchKeyword}&quot; 검색 결과
              </h2>
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 text-body2-regular text-grayScale-600 hover:text-grayScale-900"
              >
                검색 초기화
              </button>
            </div>
            <MatchingBody
              country={selectedCountry}
              category={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchKeyword={searchKeyword}
            />
          </div>
        ) : (
          /* 일반 모드 */
          <MatchingBody
            country={selectedCountry}
            category={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}
      </div>
    </div>
  );
}
