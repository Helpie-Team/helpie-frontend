import { useMutation } from '@tanstack/react-query';
import { socialSignup } from '../../api/auth/auth';
import { SocialSignupRequest } from '../../lib/schemas/auth';

interface UseSignupOptions {
  onSuccess?: (accessToken: string, refreshToken: string) => void;
  onError?: (error: Error) => void;
}

export function useSignup(options?: UseSignupOptions) {
  const mutation = useMutation({
    mutationFn: async (data: SocialSignupRequest) => {
      const result = await socialSignup(data);
      
      if (!result.success) {
        throw new Error(result.message || '회원가입에 실패했습니다.');
      }
      
      return result;
    },
    onSuccess: (result) => {
      if (result.success && result.data?.accessToken && result.data?.refreshToken) {
        options?.onSuccess?.(result.data.accessToken, result.data.refreshToken);
      }
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return {
    signup: mutation.mutate,
    signupAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
