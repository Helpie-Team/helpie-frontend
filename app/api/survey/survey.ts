import apiClient from '../axios/instance';
import { BasicInfoRequest, BasicInfoResponse, BasicInfoResponseData } from '../types/survey/survey';
import { ApiError, AxiosErrorResponse } from '../types/axios';

/**
 * 기본 정보 제출 (설문조사)
 * @param request - BasicInfoRequest
 * @returns BasicInfoResponseData
 */
export async function submitBasicInfo(request: BasicInfoRequest): Promise<BasicInfoResponseData> {
  try {
    const response = await apiClient.post<BasicInfoResponse | BasicInfoResponseData>('/surveys/basic-info', request);
    // result 안에 데이터가 있으면 result를, 없으면 직접 데이터를 반환
    const data = response.data;
    
    // data가 객체이고 result 속성이 있는지 안전하게 확인
    if (data && typeof data === 'object' && 'result' in data && data.result) {
      return data.result;
    }
    
    // 직접 BasicInfoResponseData 형태로 반환되는 경우
    return data as BasicInfoResponseData;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

/**
 * 기본 정보 조회 (설문조사)
 * @returns BasicInfoResponseData
 */
export async function getBasicInfo(): Promise<BasicInfoResponseData> {
  try {
    const response = await apiClient.get<BasicInfoResponseData>('/surveys/basic-info');
    // API가 직접 데이터를 반환하는 경우
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

