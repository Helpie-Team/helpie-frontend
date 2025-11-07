'use client';

import React from 'react';
import StepLayout from '../StepLayout';
import { OptionButton } from '../OptionButton';
import { useLanguageStore, Language } from '@/app/lib/stores/languageStore';

const languageOptions = [
  { value: 'korean' as Language, label: '한국어' },
  { value: 'english' as Language, label: 'English' },
  { value: 'chinese' as Language, label: '中文語' },
  { value: 'japanese' as Language, label: '日本語' },
  { value: 'spanish' as Language, label: 'Español' },
  { value: 'french' as Language, label: 'Français' },
];

export default function Step4() {
  const { selectedLanguages, toggleLanguage } = useLanguageStore();
  const isNextDisabled = selectedLanguages.length === 0;

  return (
    <StepLayout
      title="사용가능한 언어를 선택해주세요"
      rightAction={
        <span className="text-body3 text-white">복수선택</span>
      }
      isNextDisabled={isNextDisabled}
    >
      <div className="space-y-3">
        {languageOptions.map((option) => (
          <OptionButton
            key={option.value}
            value={option.value}
            label={option.label}
            isSelected={selectedLanguages.includes(option.value)}
            onClick={() => toggleLanguage(option.value)}
          />
        ))}
      </div>
    </StepLayout>
  );
}

