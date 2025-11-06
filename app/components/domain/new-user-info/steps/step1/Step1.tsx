'use client';

import React, { useState, useEffect } from 'react';
import StepLayout from '../../StepLayout';
import { useCityStore } from '@/app/lib/stores/cityStore';
import {
  getFavoriteCities,
  getAllCitiesGrouped,
} from '@/app/api/location/location';
import { City as APICity } from '@/app/api/types/location/location';
import FavoriteCities from './FavoriteCities';
import OtherCities from './OtherCities';

export default function Step1() {
  const { selectedCity, setCityFromAPI } = useCityStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteCities, setFavoriteCities] = useState<APICity[]>([]);
  const [allCities, setAllCities] = useState<Record<string, APICity[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<APICity[]>([]);

  // 즐겨찾는 도시와 전체 도시 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [favoritesResponse, allCitiesResponse] = await Promise.all([
          getFavoriteCities(),
          getAllCitiesGrouped(),
        ]);
        setFavoriteCities(favoritesResponse.result || []);
        setAllCities(allCitiesResponse.result || {});
      } catch (error) {
        console.error('도시 데이터 조회 실패:', error);
        setFavoriteCities([]);
        setAllCities({});
      } finally {
        setIsLoading(false);
      }
    };

    // 클라이언트에서만 실행
    if (typeof window !== 'undefined') {
      fetchData();
    }
  }, []);

  // 검색어에 따른 도시 필터링
  useEffect(() => {
    if (!searchQuery.trim() || Object.keys(allCities).length === 0) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.trim();
    const queryLower = query.toLowerCase();
    const results: APICity[] = [];

    Object.values(allCities).forEach((cities) => {
      if (!Array.isArray(cities)) return;

      cities.forEach((city) => {
        if (!city || !city.country) return;

        const cityName = city.name || '';
        const englishName = (city.englishName || '').toLowerCase();
        const countryName = city.country.name || '';
        const countryEnglishName = (city.country.englishName || '').toLowerCase();

        const matches =
          cityName.includes(query) ||
          cityName.toLowerCase().includes(queryLower) ||
          englishName.includes(queryLower) ||
          countryName.includes(query) ||
          countryName.toLowerCase().includes(queryLower) ||
          countryEnglishName.includes(queryLower);

        if (matches) {
          results.push(city);
        }
      });
    });

    const uniqueResults = results.filter(
      (city, index, self) =>
        index === self.findIndex((c) => c.id === city.id)
    );

    uniqueResults.sort((a, b) => {
      if (a.country.name !== b.country.name) {
        return a.country.name.localeCompare(b.country.name, 'ko');
      }
      return a.name.localeCompare(b.name, 'ko');
    });

    setSearchResults(uniqueResults);
  }, [searchQuery, allCities]);

  const isNextDisabled = !selectedCity;

  const handleFavoriteCityClick = (city: APICity) => {
    setCityFromAPI(city);
  };

  const handleSearchCityClick = (city: APICity) => {
    setCityFromAPI(city);
    setSearchQuery(''); // 검색 인풋 초기화
  };

  return (
    <StepLayout
      title="원하는 지역을 선택해주세요."
      isNextDisabled={isNextDisabled}
      showBackButton={false}
    >
      <div className="w-full space-y-8">
        <FavoriteCities
          favoriteCities={favoriteCities}
          isLoading={isLoading}
          onCityClick={handleFavoriteCityClick}
        />
        <OtherCities
          searchQuery={searchQuery}
          searchResults={searchResults}
          isLoading={isLoading}
          favoriteCities={favoriteCities}
          onSearchChange={setSearchQuery}
          onCityClick={handleSearchCityClick}
        />
      </div>
    </StepLayout>
  );
}

