'use client';

import { getEnvConfig } from '../../../lib/types/env';

interface GoogleLoginButtonProps {
  socialType: 'GOOGLE' | 'KAKAO';
}

const GoogleLoginButton = ({ socialType = 'GOOGLE' }: GoogleLoginButtonProps) => {
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
           className="w-full bg-white border border-gray-300 rounded-3xl px-4 py-3 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
            <span className="text-black font-medium">Google로 이용하기</span>
          </button>
  );
};

export default GoogleLoginButton;
