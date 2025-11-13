export interface BasicInfoRequest {
  cityId: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  ageGroup: 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'OTHER';
  languages: string[];
  interests: string[];
}

export interface BasicInfoResponseData {
  id: number;
  userId: number;
  cityName: string;
  cityId: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  ageGroup: 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'OTHER';
  languages: string[];
  interests: string[];
}

export interface BasicInfoResponse {
  statusCode?: number;
  message?: string;
  result?: BasicInfoResponseData;
  // API가 직접 데이터를 반환하는 경우를 대비
  id?: number;
  userId?: number;
  cityName?: string;
  cityId?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  ageGroup?: 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'OTHER';
  languages?: string[];
  interests?: string[];
}

