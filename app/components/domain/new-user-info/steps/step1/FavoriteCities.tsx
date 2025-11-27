'use client';

import React from 'react';
import Image from 'next/image';
import { useCityStore } from '@/app/lib/stores/cityStore';
import { City as APICity } from '@/app/api/types/location/location';

// 도시 이미지 매핑
const cityImageMap: Record<string, string> = {
  SEOUL: '/images/seoul.png',
  TOKYO: '/images/tokyo.png',
  SHANGHAI: '/images/shanghai.png',
  LOS_ANGELES: '/images/LA.png',
  LONDON: '/images/london.png',
};

interface FavoriteCitiesProps {
  favoriteCities: APICity[];
  isLoading: boolean;
  onCityClick: (city: APICity) => void;
}

export default function FavoriteCities({
  favoriteCities,
  isLoading,
  onCityClick,
}: FavoriteCitiesProps) {
  const { selectedCity } = useCityStore();

  const isFavoriteSelected =
    selectedCity &&
    favoriteCities.some((city) => city.id === selectedCity.id);

  const getCityImage = (cityCode: string): string => {
    return cityImageMap[cityCode] || '/images/seoul.png';
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-5 h-5 rounded-full border-5 flex items-center justify-center ${
            isFavoriteSelected
              ? 'border-key-100 bg-grayScale-100'
              : 'border-key-300 bg-white'
          }`}
        >
          {isFavoriteSelected && (
            <div className="w-1 h-1 rounded-full bg-white" />
          )}
        </div>
        <span className="text-body2 text-grayScale-700">즐겨찾는 도시</span>
        {isFavoriteSelected && selectedCity && (
          <div className="ml-auto px-3 py-1 bg-[var(--color-key-100)] rounded-lg">
            <span className="text-body3 text-white">
              {selectedCity.country} {selectedCity.name}
            </span>
          </div>
        )}
      </div>

      {/* City Cards */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="text-body2 text-grayScale-500">로딩 중...</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 w-full pb-2">
          {favoriteCities.map((city) => {
            const isSelected = selectedCity?.id === city.id;
            return (
              <button
                key={city.id}
                onClick={() => onCityClick(city)}
                className={`w-[calc((100%-2rem)/3)] sm:w-[7.125rem] h-[6.8125rem] rounded-lg overflow-hidden relative transition-all ${
                  isSelected
                    ? 'ring-2 ring-[var(--color-key-100)] ring-offset-2'
                    : ''
                }`}
              >
                <Image
                  src={getCityImage(city.code)}
                  alt={city.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <span className="text-body3 text-white font-medium">
                    {city.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

