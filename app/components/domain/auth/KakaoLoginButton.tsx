'use client';

import { useModalStore } from '../../../lib/stores/modalStore';
import { StaticImageData } from 'next/image';
import Image from 'next/image';

const ensureEnv = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const KAKAO_CLIENT_ID = ensureEnv(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID, 'NEXT_PUBLIC_KAKAO_CLIENT_ID');
const KAKAO_REDIRECT_URI = ensureEnv(process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI, 'NEXT_PUBLIC_KAKAO_REDIRECT_URI');
const KAKAO_AUTH_URL = ensureEnv(process.env.NEXT_PUBLIC_KAKAO_AUTH_URL, 'NEXT_PUBLIC_KAKAO_AUTH_URL');
interface KakaoLoginButtonProps {
  socialType: 'GOOGLE' | 'KAKAO';
  icon: StaticImageData;
}

const KakaoLoginButton = ({ socialType = 'KAKAO', icon }: KakaoLoginButtonProps) => {
  const { modalType } = useModalStore();
  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      response_type: 'code',
      state: socialType, 
    });

    const url = `${KAKAO_AUTH_URL}?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <button 
      onClick={handleLogin}
      className="w-full bg-yellow-400 border border-yellow-400 rounded-3xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors"
    >
      <Image src={icon} alt="Kakao" width={24} height={24} />
      <span className="text-black font-medium">Kakao로 {modalType === 'login' ? '로그인' : '이용하기'}</span>
    </button>
  );
};

export default KakaoLoginButton;