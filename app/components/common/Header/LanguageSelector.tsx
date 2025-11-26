'use client';

import React, { useEffect, useState } from 'react';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'KR' | 'EN'>('KR');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (lang: 'KR' | 'EN') => {
    setSelectedLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative language-selector">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-grayScale-200 px-3 py-1.5 text-sm text-grayScale-title transition hover:bg-grayScale-100"
      >
        <span className="font-medium">{selectedLanguage}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-[12px] shadow-lg border border-grayScale-200 overflow-hidden z-50 min-w-[160px]">
          <button
            type="button"
            onClick={() => handleLanguageSelect('KR')}
            className={`w-full px-4 py-3 text-left text-sm transition-colors ${
              selectedLanguage === 'KR'
                ? 'font-semibold text-grayScale-title bg-grayScale-50'
                : 'text-grayScale-600 hover:bg-grayScale-50'
            }`}
          >
            한국어 (KR)
          </button>
          <div className="h-[1px] bg-grayScale-200" />
          <button
            type="button"
            onClick={() => handleLanguageSelect('EN')}
            className={`w-full px-4 py-3 text-left text-sm transition-colors ${
              selectedLanguage === 'EN'
                ? 'font-semibold text-grayScale-title bg-grayScale-50'
                : 'text-grayScale-600 hover:bg-grayScale-50'
            }`}
          >
            English (EN)
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

