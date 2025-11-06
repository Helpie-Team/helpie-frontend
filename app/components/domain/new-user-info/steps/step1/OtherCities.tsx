'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCityStore } from '@/app/lib/stores/cityStore';
import { City as APICity } from '@/app/api/types/location/location';
import SearchIcon from '@/public/icons/searchIcon.png';
import ArrowRightIcon from '@/public/icons/gt_icon.svg';
interface OtherCitiesProps {
  searchQuery: string;
  searchResults: APICity[];
  isLoading: boolean;
  favoriteCities: APICity[];
  onSearchChange: (query: string) => void;
  onCityClick: (city: APICity) => void;
}

export default function OtherCities({
  searchQuery,
  searchResults,
  isLoading,
  favoriteCities,
  onSearchChange,
  onCityClick,
}: OtherCitiesProps) {
  const { selectedCity } = useCityStore();
  const [isComposing, setIsComposing] = useState(false);

  // 즐겨찾는 도시에 없고, 선택된 도시가 있으면 "그 외 도시"에서 선택된 것으로 간주
  const isOtherSelected =
    selectedCity &&
    !favoriteCities.some((city) => city.id === selectedCity.id);

  const handleSearchIconClick = () => {
    if (searchResults.length > 0) {
      onCityClick(searchResults[0]);
    }
  };

  // 검색어와 매칭되는 텍스트를 bold 처리하는 함수
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) {
      return <span>{text}</span>;
    }

    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);

    if (index === -1) {
      return <span>{text}</span>;
    }

    const beforeMatch = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const afterMatch = text.substring(index + query.length);

    return (
      <>
        {beforeMatch}
        <span className="font-bold">{match}</span>
        {afterMatch}
      </>
    );
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-5 h-5 rounded-full border-5 flex items-center justify-center ${
            isOtherSelected
              ? 'border-key-100 bg-grayScale-100'
              : 'border-key-300 bg-white'
          }`}
        >
          {isOtherSelected && (
            <div className="w-1 h-1 rounded-full bg-white" />
          )}
        </div>
        <span className="text-body2 text-grayScale-700">그 외 도시</span>
        {isOtherSelected && selectedCity && (
          <div className="ml-auto px-3 py-1 bg-[var(--color-key-100)] rounded-lg">
            <span className="text-body3 text-white">
              {selectedCity.fullPath || `${selectedCity.country} ${selectedCity.name}`}
            </span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing && searchResults.length > 0) {
              e.preventDefault();
              onCityClick(searchResults[0]);
            }
          }}
          placeholder="도시를 검색하세요."
          className="w-full px-4 py-3 rounded-3xl border border-grayScale-300 bg-white text-body3 text-grayScale-700 placeholder:text-grayScale-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-key-100)] focus:border-transparent pr-12"
        />
        <button
          type="button"
          onClick={handleSearchIconClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-grayScale-700 flex items-center justify-center hover:bg-grayScale-600 transition-colors"
        >
          <Image
            src={SearchIcon}
            alt="검색"
            width={32}
            height={32}
          />
        </button>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="mt-3">
          {isLoading ? (
            <div className="px-4 py-3 text-center text-body3 text-grayScale-500">
              검색 중...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="w-full rounded-lg border border-grayScale-300 bg-white overflow-hidden">
              {searchResults.map((city, index) => (
                <button
                  key={city.id}
                  onClick={() => onCityClick(city)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    selectedCity?.id === city.id
                      ? 'bg-[var(--color-key-300)]'
                      : 'bg-white hover:bg-grayScale-100'
                  } ${index !== searchResults.length - 1 ? 'border-b border-grayScale-200' : ''}`}
                >
                  <div className='flex flex-row gap-2 items-center'>
                    <span className='text-body3 text-grayScale-700'>
                      {renderHighlightedText(city.country.name, searchQuery)}
                    </span>
                    <Image src={ArrowRightIcon} alt="arrow-right" width={4} height={8}/>
                    <span className='text-body3 text-grayScale-700'>
                      {renderHighlightedText(city.name, searchQuery)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-body3 text-grayScale-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

