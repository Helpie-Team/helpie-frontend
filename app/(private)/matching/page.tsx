import React from 'react';
import MatchingBar from '@/app/components/matching/MatchingBar';
import MatchingBody from '@/app/components/matching/MatchingBody';
import ImageSwiper from '@/app/components/matching/ImageSwiper';
import RecommendCarousel from '@/app/components/matching/RecommendCarousel';

export default function Page() {
  return (
    <div className="h-[3589px] flex flex-col items-center gap-8">
      <MatchingBar />
      <div className="w-[1000px]">
        <RecommendCarousel />
      </div>
      <ImageSwiper />
      <div className="w-[1000px]">
        <MatchingBody />
      </div>
    </div>
  );
}