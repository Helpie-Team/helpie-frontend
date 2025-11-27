'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getRefreshToken, getAccessToken, setTokens, updateAccessToken, TOKEN_CHANGE_EVENT } from '@/app/lib/utils/token';
import axios from 'axios';

const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30분 (밀리초)

/**
 * 30분마다 자동으로 액세스 토큰을 갱신하는 훅
 */
export function useTokenRefresh() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  const refreshAccessToken = useCallback(async () => {
    // 이미 갱신 중이면 스킵
    if (isRefreshingRef.current) {
      return;
    }

    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      return;
    }

    try {
      isRefreshingRef.current = true;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        return;
      }

      const response = await axios.post<{ accessToken: string; refreshToken?: string }>(
        `${apiBaseUrl}/auth/token`,
        { refreshToken: refreshTokenValue }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // 토큰 저장
      if (newRefreshToken) {
        setTokens(accessToken, newRefreshToken);
      } else {
        // refreshToken이 없으면 기존 refreshToken 유지하고 accessToken만 업데이트
        updateAccessToken(accessToken);
      }
    } catch (error) {
      console.error('자동 토큰 갱신 실패:', error);
      // 갱신 실패 시 인터셉터에서 처리하도록 함
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // 자동 갱신 시작/중지
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      return; // 이미 실행 중
    }

    refreshAccessToken(); // 즉시 한 번 실행
    intervalRef.current = setInterval(refreshAccessToken, TOKEN_REFRESH_INTERVAL);
  }, [refreshAccessToken]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 초기 마운트 시 자동 갱신 시작
  useEffect(() => {
    if (getAccessToken() && getRefreshToken()) {
      startAutoRefresh();
    }

    return () => {
      stopAutoRefresh();
    };
  }, [startAutoRefresh, stopAutoRefresh]);

  // 토큰 변경 이벤트 리스너
  useEffect(() => {
    const handleTokenChange = () => {
      const hasToken = !!getAccessToken() && !!getRefreshToken();
      
      if (hasToken) {
        startAutoRefresh();
      } else {
        stopAutoRefresh();
      }
    };

    window.addEventListener(TOKEN_CHANGE_EVENT, handleTokenChange);
    return () => {
      window.removeEventListener(TOKEN_CHANGE_EVENT, handleTokenChange);
    };
  }, [startAutoRefresh, stopAutoRefresh]);
}

