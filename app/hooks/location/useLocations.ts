import { useQuery } from '@tanstack/react-query';
import { getCountries, getCities, getCitiesByCountry, getAllCitiesFlat,  } from '@/app/api/location/location';

export const useCountries = () =>
  useQuery({ queryKey: ['countries'], queryFn: getCountries, staleTime: 5 * 60 * 1000 });

export const useCitiesGrouped = () =>
  useQuery({ queryKey: ['cities','grouped'], queryFn: getCities, staleTime: 5 * 60 * 1000 });

export const useCitiesFlat = () =>
  useQuery({ queryKey: ['cities','flat'], queryFn: getAllCitiesFlat, staleTime: 5 * 60 * 1000 });

export const useCitiesByCountry = (countryCode?: string) =>
  useQuery({
    queryKey: ['cities','byCountry', countryCode],
    queryFn: () => getCitiesByCountry(countryCode!),
    enabled: !!countryCode,
    staleTime: 5 * 60 * 1000,
  });

