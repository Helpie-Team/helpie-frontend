'use client';

import { useTokenRefresh } from '@/app/hooks/auth/useTokenRefresh';

/**
 * 자동 토큰 갱신을 활성화하는 Provider 컴포넌트
 */
export default function TokenRefreshProvider() {
  useTokenRefresh();
  return null;
}

