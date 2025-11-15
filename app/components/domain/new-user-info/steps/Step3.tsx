'use client';

import React from 'react';
import StepLayout from '../StepLayout';
import { OptionButton } from '../OptionButton';
import { useAgeStore, AgeRange } from '@/app/lib/stores/ageStore';

const ageOptions = [
  { value: '10s' as AgeRange, label: '10대' },
  { value: '20s' as AgeRange, label: '20대' },
  { value: '30s' as AgeRange, label: '30대' },
  { value: '40s' as AgeRange, label: '40대' },
  { value: 'other' as AgeRange, label: '기타' },
];

export default function Step3() {
  const { selectedAgeRange, setSelectedAgeRange } = useAgeStore();
  const isNextDisabled = !selectedAgeRange;

  return (
    <StepLayout
      title="나이대를 선택해주세요"
      isNextDisabled={isNextDisabled}
    >
      <div className="space-y-3">
        {ageOptions.map((option) => (
          <OptionButton
            key={option.value}
            value={option.value}
            label={option.label}
            isSelected={selectedAgeRange === option.value}
            onClick={() => setSelectedAgeRange(option.value)}
          />
        ))}
      </div>
    </StepLayout>
  );
}

