'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { socialLogin } from '../../../api/auth/auth';
import { getEnvConfig } from '../../../../env';
import { useModalStore } from '../../../lib/stores/modalStore';
import ModalForm from '../../../components/domain/auth/modal-form/signup/sns/ModalForm';
import { isGoogleProfile, isKakaoProfile } from '../../../api/types/auth/auth';
import { setTokens } from '../../../lib/utils/token';
import GoogleIcon from '@/public/icons/google_icon.png';
import KakaoIcon from '@/public/icons/kakao_icon.svg';

function SocialCallbackContent() {
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
            
            if (result.data.data?.socialAccessToken) {
              let email = '';
              if (result.data.data.profile) {
                if (isGoogleProfile(result.data.data.profile)) {
                  email = result.data.data.profile.rawData.email || result.data.data.user?.email || '';
                } else if (isKakaoProfile(result.data.data.profile)) {
                  email = result.data.data.profile.rawData.kakao_account.email || result.data.data.user?.email || '';
                }
              } else {
                email = result.data.data.user?.email || '';
              }
              
              setUserEmail(email);
              setSocialToken(result.data.data.socialAccessToken);
              setStatus('signup');
              setMessage('회원가입 정보를 입력해주세요.');
              openSignupForm(result.data.data.socialAccessToken);
            } else {
              setStatus('success');
              setMessage('로그인 성공! 메인 페이지로 이동합니다...');
              
              
              if (result.data?.accessToken && result.data?.refreshToken) {
                setTokens(result.data.accessToken, result.data.refreshToken);
              }
              
              
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
        console.error('소셜 로그인 콜백 처리 중 오류 발생', error);
        setStatus('error');
        setMessage('네트워크 오류가 발생했습니다.');
        
      }
    };

    handleLogin();
  }, [code, state, openSignupForm]);

  if (status === 'signup' && userEmail && socialToken) {
    const iconSrc = state === 'GOOGLE' ? GoogleIcon.src : KakaoIcon.src;

    return (
      <ModalForm
        email={userEmail}
        socialAccessToken={socialToken}
        socialType={state as 'GOOGLE' | 'KAKAO'}
        icon={iconSrc}
      />
    );
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

export default function SocialCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">잠시만 기다려주세요...</p>
          </div>
        </div>
      }
    >
      <SocialCallbackContent />
    </Suspense>
  );
}
