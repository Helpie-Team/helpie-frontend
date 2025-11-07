'use client';

import React from 'react';
import StepLayout from '../StepLayout';
import { OptionButton } from '../OptionButton';
import { useGenderStore, Gender } from '@/app/lib/stores/genderStore';

const genderOptions = [
  { value: 'female' as Gender, label: '여자' },
  { value: 'male' as Gender, label: '남자' },
  { value: 'other' as Gender, label: '기타' },
];

export default function Step2() {
  const { selectedGender, setSelectedGender } = useGenderStore();
  const isNextDisabled = !selectedGender;

  return (
    <StepLayout
      title="성별을 선택해주세요"
      isNextDisabled={isNextDisabled}
    >
      <div className="space-y-3">
        {genderOptions.map((option) => (
          <OptionButton
            key={option.value}
            value={option.value}
            label={option.label}
            isSelected={selectedGender === option.value}
            onClick={() => setSelectedGender(option.value)}
          />
        ))}
      </div>
    </StepLayout>
  );
}

