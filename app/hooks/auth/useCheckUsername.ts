import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { checkUsername } from '../../api/auth/auth';

interface CheckUsernameRequest {
  username: string;
}

interface CheckUsernameResponse {
  statusCode: number;
  message: string;
  result: boolean;
}

/**
 * 별명 중복 체크를 위한 API 호출 함수
 */
async function checkUsernameAPI(data: CheckUsernameRequest): Promise<CheckUsernameResponse> {
  try {
  
    const isAvailable = await checkUsername(data.username);
  
    return {
      statusCode: 200,
      message: isAvailable ? '사용 가능한 별명입니다.' : '이미 사용 중인 별명입니다.',
      result: isAvailable,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        return {
          statusCode: 409,
          message: '이미 사용 중인 별명입니다.',
          result: true,   
        };
      }
      
      // 다른 HTTP 에러인 경우
      if (error.response) {
        const errorData = error.response.data;
        throw new Error(errorData?.message || '별명 확인 중 오류가 발생했습니다.');
      }
      
      throw error;
    }
    
    // 기타 에러
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('중복 체크 중 오류가 발생했습니다.');
  }
}

export function useCheckUsername() {
  const mutation = useMutation({
    mutationFn: checkUsernameAPI,
  });

  return {
    checkUsername: mutation.mutate,
    checkUsernameAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
