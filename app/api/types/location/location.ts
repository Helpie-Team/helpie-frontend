export interface Country {
  id: number;
  code: string;
  name: string;
  englishName: string;
}

export interface City {
  id: number;
  code: string;
  name: string;
  englishName: string;
  country: Country;
  isFavorite: boolean;
}

export interface CountryResponse {
  statusCode: number;
  message: string;
  result: Country[];
}

export interface CityResponse {
  statusCode: number;
  message: string;
  result: City[];
}

export interface CitiesGroupedResponse {
  statusCode: number;
  message: string;
  result: Record<string, City[]>;
}

export interface FavoriteCitiesResponse {
  statusCode: number;
  message: string;
  result: City[];
}

