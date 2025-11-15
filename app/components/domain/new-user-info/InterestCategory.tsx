'use client';

import React from 'react';
import { useInterestStore } from '@/app/lib/stores/interestStore';
import { SelectionIndicator } from './SelectionIndicator';

interface InterestTag {
  id: string;
  label: string;
}

interface InterestCategoryProps {
  title: string;
  interests: InterestTag[];
}

export default function InterestCategory({ title, interests }: InterestCategoryProps) {
  const { selectedInterests, toggleInterest } = useInterestStore();

  return (
    <div className="w-full">
      {/* Category Title */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-3 h-8 bg-[var(--color-key-300)] rounded-md">
          <span className="text-body2 text-grayScale-700">{title}</span>
        </div>
      </div>

      {/* Interest Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {interests.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id);
          
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                isSelected
                  ? 'border-key-100 bg-white text-grayScale-black'
                  : 'bg-white border-grayScale-300 text-grayScale-700'
              }`}
            >
              <SelectionIndicator isSelected={isSelected} />
              <span className="text-body3">{interest.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

