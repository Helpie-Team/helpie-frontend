'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { socialLogin } from '../../../api/auth/auth';
import { getEnvConfig } from '../../../lib/types/env';
import { useModalStore } from '../../../lib/stores/modalStore';
import ModalForm from '../../../components/domain/auth/modal-form/ModalForm';
import { isGoogleProfile, isKakaoProfile } from '../../../api/types/auth/auth';
import { setTokens } from '../../../lib/utils/token';

export default function SocialCallback() {
  const params = useSearchParams();
  const code = params.get('code');
  const state = params.get('state') as 'GOOGLE' | 'KAKAO' | null;
  const { openSignupForm } = useModalStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'signup'>('loading');
  const [message, setMessage] = useState('로그인 처리 중...');
  const [userEmail, setUserEmail] = useState('');
  const [socialToken, setSocialToken] = useState('');

  useEffect(() => {
    if (!code || !state) {
      setStatus('error');
      setMessage('인증 정보를 받지 못했습니다.');
      return;
    }

    const handleLogin = async () => {
      try {
        const envConfig = getEnvConfig();
        const redirectUri = state === 'GOOGLE' ? envConfig.GOOGLE_REDIRECT_URI : envConfig.KAKAO_REDIRECT_URI;
        
        const result = await socialLogin({
          code,
          redirectUri,
          socialType: state,
        });
        

        if (result.success) {
          if (result.data) {
            // socialAccessToken이 있으면 회원가입 폼 표시
            if (result.data.data?.socialAccessToken) {
              let email = '';
              
              // socialType에 따라 이메일 추출 방식 다르게 처리
              if (result.data.data.profile) {
                if (isGoogleProfile(result.data.data.profile)) {
                  // Google의 경우
                  email = result.data.data.profile.rawData.email || result.data.data.user?.email || '';
                } else if (isKakaoProfile(result.data.data.profile)) {
                  // Kakao의 경우
                  email = result.data.data.profile.rawData.kakao_account.email || result.data.data.user?.email || '';
                }
              } else {
                // 프로필이 없는 경우 user 객체에서 이메일 추출
                email = result.data.data.user?.email || '';
              }
              
              setUserEmail(email);
              setSocialToken(result.data.data.socialAccessToken);
              setStatus('signup');
              setMessage('회원가입 정보를 입력해주세요.');
              openSignupForm(result.data.data.socialAccessToken);
            } else {
              // 기존 사용자 로그인
              setStatus('success');
              setMessage('로그인 성공! 메인 페이지로 이동합니다...');
              
              // 토큰을 쿠키와 localStorage에 저장
              if (result.data?.accessToken && result.data?.refreshToken) {
                setTokens(result.data.accessToken, result.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(result.data.data?.user));
              }
              
              // 메인 페이지로 리다이렉트
              setTimeout(() => {
                window.location.href = '/';
              }, 100);
            }
          }
        } else {
          setStatus('error');
          setMessage(result.message || '로그인에 실패했습니다.');
          
        }
      } catch (error) {
        setStatus('error');
        setMessage('네트워크 오류가 발생했습니다.');
        
      }
    };

    handleLogin();
  }, [code, state, openSignupForm]);

  // 회원가입 폼이 표시되는 경우
  if (status === 'signup' && userEmail && socialToken) {
    return <ModalForm email={userEmail} socialAccessToken={socialToken} socialType={state as 'GOOGLE' | 'KAKAO'} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="text-green-600 text-4xl mb-2">✓</div>
          )}
          {status === 'error' && (
            <div className="text-red-600 text-4xl mb-2">✗</div>
          )}
        </div>
        <p className={`text-lg ${status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
          {message}
        </p>
      </div>
    </div>
  );
}
