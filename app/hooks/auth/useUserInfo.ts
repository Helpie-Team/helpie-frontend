import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '../../api/auth/auth';
import { UserInfoResponse } from '../../api/types/auth/auth';
import { isAuthenticated } from '../../lib/utils/token';
import { useUserStore } from '../../lib/stores/userStore';

export function useUserInfo() {
  const { setUserInfo, clearUserInfo } = useUserStore();
  const isAuth = isAuthenticated();

  const query = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const result = await getUserInfo();
      
      if (!result.success || !result.data) {
        clearUserInfo();
        throw new Error(result.message || '사용자 정보 조회에 실패했습니다.');
      }
      
      const userData = result.data as UserInfoResponse;
      setUserInfo(userData);
      return userData;
    },
    enabled: isAuth, // 인증된 경우에만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 1,
    retryOnMount: false,
  });

  return {
    userInfo: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
  };
}

