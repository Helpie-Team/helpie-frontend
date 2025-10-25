'use client';

import { getEnvConfig } from '../../../lib/types/env';

interface KakaoLoginButtonProps {
  socialType: 'GOOGLE' | 'KAKAO';
}

const KakaoLoginButton = ({ socialType = 'KAKAO' }: KakaoLoginButtonProps) => {
  const handleLogin = () => {
    const envConfig = getEnvConfig();
    const { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI, KAKAO_AUTH_URL } = envConfig;
    
    const params = new URLSearchParams({
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      response_type: 'code',
      state: socialType, // socialType을 state로 전달
    });

    const url = `${KAKAO_AUTH_URL}?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <button 
      onClick={handleLogin}
      className="w-full bg-yellow-400 border border-yellow-400 rounded-3xl px-4 py-3 flex items-center justify-center hover:bg-yellow-500 transition-colors"
    >
      <div className="w-6 h-6 bg-yellow-300 rounded-full mr-3"></div>
      <span className="text-black font-medium">Kakao로 이용하기</span>
    </button>
  );
};

export default KakaoLoginButton;