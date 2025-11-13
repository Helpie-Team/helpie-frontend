'use client';

import React, { useState } from 'react';
import MatchingBar from '@/app/components/matching/MatchingBar';
import MatchingBody from '@/app/components/matching/MatchingBody';
import ImageSwiper from '@/app/components/matching/ImageSwiper';
import RecommendCarousel from '@/app/components/matching/RecommendCarousel';
import { GroupCategory } from '@/app/api/types/matching/matching';

export default function Page() {
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState<GroupCategory>("ALL");

  return (
    <div className="flex flex-col items-center gap-8 pb-20">
      <MatchingBar
        onCountrySelect={(code) => {
          setSelectedCountry(code);
        }}
      />
      <div className="w-[1000px]">
        <RecommendCarousel />
      </div>
      <ImageSwiper />
      <div className="w-[1000px]">
        <MatchingBody
          country={selectedCountry}
          category={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
    </div>
  );
}