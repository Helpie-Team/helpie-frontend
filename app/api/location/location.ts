import apiClient from '../axios/instance';
import {
  CountryResponse,
  CityResponse,
  CitiesGroupedResponse,
  FavoriteCitiesResponse,
  City,
} from '../types/location/location';
import { ApiError, AxiosErrorResponse } from '../types/axios';

/**
 * 전체 국가 조회
 * @returns: CountryResponse
 */
export async function getCountries(): Promise<CountryResponse> {
  try {
    const response = await apiClient.get<CountryResponse>('/locations/countries');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

/**
 * 국가별 도시 조회
 * @param countryCode - 국가 코드 (예: 'KOREA', 'USA')
 * @returns: CityResponse
 */
export async function getCitiesByCountry(countryCode: string): Promise<CityResponse> {
  try {
    const response = await apiClient.get<CityResponse>(
      `/locations/countries/${countryCode}/cities`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

/**
 * 전체 도시 조회 (국가별로 그룹핑)
 * @returns: CitiesGroupedResponse
 */
export async function getAllCitiesGrouped(): Promise<CitiesGroupedResponse> {
  try {
    const response = await apiClient.get<CitiesGroupedResponse>('/locations/cities');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

/**
 * 즐겨찾는 도시 조회
 * @returns: FavoriteCitiesResponse
 */
export async function getFavoriteCities(): Promise<FavoriteCitiesResponse> {
  try {
    const response = await apiClient.get<FavoriteCitiesResponse>('/locations/cities/favorites');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

/**
 * 전체 도시 조회 (flat 배열)
 * 모든 국가의 도시 목록을 반환
 * @returns: City[]
 */
export async function getAllCitiesFlat(): Promise<City[]> {
  try {
    // 1. 전체 국가 목록 가져오기
    const countriesResponse = await getCountries();

    // 2. 각 국가별로 도시 목록 가져오기
    const allCities: City[] = [];

    for (const country of countriesResponse.result) {
      try {
        const citiesResponse = await getCitiesByCountry(country.code);
        allCities.push(...citiesResponse.result);
      } catch (error) {
        console.warn(`${country.name} 도시 조회 실패:`, error);
      }
    }

    return allCities;
  } catch (error) {
    console.error('getAllCitiesFlat 에러:', error);
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

