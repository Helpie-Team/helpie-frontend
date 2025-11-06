'use client';

import React, { useState } from 'react';

export default function MatchingFilter() {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = [
    '전체',
    '문화 · 취미',
    '예술 · 창작',
    '액티비티 · 라이프',
    '자기계발 · 성장',
    '사회 · 교류'
  ];

  const handleReset = () => {
    setSelectedCategory('전체');
  };

  return (
    <div className="w-[200px] h-full gap-8 flex flex-col items-ceter justify-start">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-[24px] font-bold text-black">필터</h1>
        <button
          onClick={handleReset}
          className="text-[14px] text-grayScale-400 underline hover:text-grayScale-600"
        >
          초기화
        </button>
      </div>

      {/* 카테고리 */}
      <div>
        <h2 className="text-[18px] font-semibold text-black mb-6">카테고리</h2>

        <div className="flex flex-col gap-5">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedCategory === category
                    ? 'bg-key-100'
                    : 'bg-key-300'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
              <span className="text-body1-regular text-grayScale-600" >
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
