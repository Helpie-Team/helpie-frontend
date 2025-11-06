import apiClient from '../axios/instance';
import {
  CountryResponse,
  CityResponse,
  CitiesGroupedResponse,
  FavoriteCitiesResponse,
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

