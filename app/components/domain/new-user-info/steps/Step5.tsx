'use client';

import React from 'react';
import StepLayout from '../StepLayout';
import InterestCategory from '../InterestCategory';
import { getInterestCategories } from '@/app/lib/utils/interestCategories';

export default function Step5() {
  const interestCategories = getInterestCategories();

  return (
    <StepLayout
      title="관심사를 선택해주세요."
      rightAction={
        <span className="text-body3 text-white">복수선택</span>
      }
      showNextButton={false}
    >
      {/* Interest Categories */}
      <div className="space-y-6">
        {interestCategories.map((category) => (
          <InterestCategory
            key={category.title}
            title={category.title}
            interests={category.interests}
          />
        ))}
      </div>
    </StepLayout>
  );
}
