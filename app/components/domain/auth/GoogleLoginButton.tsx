'use client';

import { getEnvConfig } from '../../../../env';
import { useModalStore } from '../../../lib/stores/modalStore';
import Image from 'next/image';

interface GoogleLoginButtonProps {
  socialType: 'GOOGLE' | 'KAKAO';
  icon: string;
}

const GoogleLoginButton = ({ socialType = 'GOOGLE', icon }: GoogleLoginButtonProps) => {
  const { modalType } = useModalStore();
  const handleLogin = () => {
    const envConfig = getEnvConfig();
    const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_SCOPE, GOOGLE_AUTH_URL } = envConfig;
    
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: GOOGLE_SCOPE,
      access_type: 'offline',
      state: socialType, // socialType을 state로 전달
    });

    const url = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    window.location.href = url;
  };

  return (
          <button onClick={handleLogin}
           className="w-full bg-white border border-gray-300 rounded-3xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <Image src={icon} alt="Google" width={20} height={20} />
            <span className="text-black font-medium">Google로 {modalType === 'login' ? '로그인' : '이용하기'}</span>
          </button>
  );
};

export default GoogleLoginButton;
