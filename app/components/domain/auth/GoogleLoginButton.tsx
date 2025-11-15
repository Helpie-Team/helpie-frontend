'use client';

import { useModalStore } from '../../../lib/stores/modalStore';
import Image from 'next/image';

const ensureEnv = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const GOOGLE_CLIENT_ID = ensureEnv(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, 'NEXT_PUBLIC_GOOGLE_CLIENT_ID');
const GOOGLE_REDIRECT_URI = ensureEnv(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI, 'NEXT_PUBLIC_GOOGLE_REDIRECT_URI');
const GOOGLE_SCOPE = ensureEnv(process.env.NEXT_PUBLIC_GOOGLE_SCOPE, 'NEXT_PUBLIC_GOOGLE_SCOPE');
const GOOGLE_AUTH_URL = ensureEnv(process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL, 'NEXT_PUBLIC_GOOGLE_AUTH_URL');

interface GoogleLoginButtonProps {
  socialType: 'GOOGLE' | 'KAKAO';
  icon: string;
}

const GoogleLoginButton = ({ socialType = 'GOOGLE', icon }: GoogleLoginButtonProps) => {
  const { modalType } = useModalStore();
  const handleLogin = () => {
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
