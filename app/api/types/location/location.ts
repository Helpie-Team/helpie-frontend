// 국가 정보
export interface Country {
  id: number;
  code: string;
  name: string;
  englishName: string;
}

// 국가 목록 조회 응답
export interface CountriesResponse {
  statusCode: number;
  message: string;
  result: Country[];
}

// 도시 정보
export interface City {
  id: number;
  code: string;
  name: string;
  englishName: string;
  country: Country;
  isFavorite: boolean;
}

// 도시 목록 조회 응답 (국가별 그룹핑)
export interface CitiesResponse {
  statusCode: number;
  message: string;
  result: Record<string, City[]>;
}

// 국가별 도시 조회 응답
export interface CitiesByCountryResponse {
  statusCode: number;
  message: string;
  result: City[];
}
