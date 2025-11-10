import apiClient from '../axios/instance';
import { BasicInfoRequest, BasicInfoResponse, BasicInfoResponseData } from '../types/survey/survey';
import { ApiError, AxiosErrorResponse } from '../types/axios';

type BasicInfoHttpMethod = 'post' | 'put';

async function mutateBasicInfo(
  method: BasicInfoHttpMethod,
  request: BasicInfoRequest,
): Promise<BasicInfoResponseData> {
  try {
    const response = await apiClient.request<BasicInfoResponse | BasicInfoResponseData>({
      method,
      url: '/surveys/basic-info',
      data: request,
    });
    const data = response.data;

    if (data && typeof data === 'object' && 'result' in data && data.result) {
      return data.result;
    }

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
 * 기본 정보 제출 (설문조사)
 * @param request - BasicInfoRequest
 * @returns BasicInfoResponseData
 */
export async function submitBasicInfo(request: BasicInfoRequest): Promise<BasicInfoResponseData> {
  return mutateBasicInfo('post', request);
}

/**
 * 기본 정보 수정 (설문조사)
 * @param request - BasicInfoRequest
 * @returns BasicInfoResponseData
 */
export async function updateBasicInfo(request: BasicInfoRequest): Promise<BasicInfoResponseData> {
  return mutateBasicInfo('put', request);
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

