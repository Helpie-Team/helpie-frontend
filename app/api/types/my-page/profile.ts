export interface SurveyBasicInfo {
  id: number;
  userId: number;
  cityName: string;
  cityId: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | string;
  ageGroup: 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'OTHER' | string;
  languages: string[];
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

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

export interface ProfileInfoResponse {
  username: string;
  email: string;
  surveyStatus: boolean;
  imageUrl: string | null;
  surveyBasicInfo: SurveyBasicInfo | null;
  city: City | null;
}
