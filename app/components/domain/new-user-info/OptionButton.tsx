'use client';

import React from 'react';
import { SelectionIndicator } from './SelectionIndicator';

interface OptionButtonProps {
  value?: string | null;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * 선택 옵션 버튼 공통 컴포넌트
 * Step2, Step3, Step4에서 사용되는 동일한 스타일의 선택 버튼
 */
export function OptionButton({ value, label, isSelected, onClick }: OptionButtonProps) {
  return (
    <button
      key={value}
      onClick={onClick}
      className={`w-full px-4 py-4 rounded-3xl border-2 text-left flex items-center gap-3 transition-all ${
        isSelected
          ? 'border-[var(--color-key-100)] bg-[var(--color-key-300)]'
          : 'border-grayScale-300 bg-white hover:border-grayScale-400'
      }`}
    >
      <SelectionIndicator isSelected={isSelected} />
      <span className="text-body1 text-grayScale-700">{label}</span>
    </button>
  );
}

