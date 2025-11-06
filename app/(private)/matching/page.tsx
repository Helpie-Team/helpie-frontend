import React from 'react';
import MatchingBar from '@/app/components/matching/MatchingBar';
import MatchingFilter from '@/app/components/matching/MatchingFilter';
import MatchingCards from '@/app/components/matching/MatchingCards';

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-8">
      <MatchingBar />
      <div className="flex w-[1000px] gap-8 ">
        <div className="flex-shrink-0">
          <MatchingFilter />
        </div>
        <div className="flex-1">
          <MatchingCards />
        </div>
      </div>
    </div>
  );
}