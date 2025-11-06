'use client';

import React from 'react';

interface SelectionIndicatorProps {
  isSelected: boolean;
}

/**
 * 선택 상태를 나타내는 인디케이터 공통 컴포넌트
 * 라디오 버튼/체크박스 스타일의 원형 인디케이터
 */
export function SelectionIndicator({ isSelected }: SelectionIndicatorProps) {
  return (
    <div className="relative">
      <div
        className={`w-5 h-5 rounded-full border-5 flex items-center justify-center ${
          isSelected
            ? 'border-key-100 bg-grayScale-100'
            : 'border-key-300 bg-white'
        }`}
      >
        {isSelected && (
          <div className="w-1 h-1 rounded-full bg-white" />
        )}
      </div>
    </div>
  );
}

