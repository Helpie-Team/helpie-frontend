import apiClient from '../axios/instance';
import {
  Country, CountriesResponse,
  City, CitiesResponse, CitiesByCountryResponse, 
} from '../types/location/location';

/** 전체 국가 목록 */
export const getCountries = async (): Promise<Country[]> => {
  const res = await apiClient.get<CountriesResponse>('/locations/countries');
  return res.data.result;
};

/** 전체 도시 (국가별 그룹핑) */
export const getCities = async (): Promise<Record<string, City[]>> => {
  const res = await apiClient.get<CitiesResponse>('/locations/cities');
  return res.data.result; // { KOREA: City[], USA: City[], ... }
};

/** 국가별 도시 */
export const getCitiesByCountry = async (countryCode: string): Promise<City[]> => {
  const res = await apiClient.get<CitiesByCountryResponse>(`/locations/countries/${countryCode}/cities`);
  return res.data.result; // City[]
};


/** 모든 도시를 평탄화 */
export const getAllCitiesFlat = async (): Promise<City[]> => {
  const grouped = await getCities();
  return Object.values(grouped).flat();
};
