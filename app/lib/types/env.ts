// 환경 변수 타입 정의

export interface EnvConfig {
  // API 설정
  API_BASE_URL: string;
  API_TIMEOUT: number;
  
  // Google OAuth 설정
  GOOGLE_CLIENT_ID: string;
  GOOGLE_REDIRECT_URI: string;
  GOOGLE_SCOPE: string;
  GOOGLE_AUTH_URL: string;
  
  // Kakao OAuth 설정
  KAKAO_CLIENT_ID: string;
  KAKAO_REDIRECT_URI: string;
  KAKAO_AUTH_URL: string;
  
  // 환경 설정
  NODE_ENV: 'development' | 'production' | 'test';
}

// 환경 변수 검증 및 기본값 설정
export const getEnvConfig = (): EnvConfig => {
  const requiredEnvVars = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://49.50.133.140:8080/api/v1',
    API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '611533793095-9i01qb97imtjetpse05b186qu9f5h46o.apps.googleusercontent.com',
    GOOGLE_REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback',
    GOOGLE_SCOPE: process.env.NEXT_PUBLIC_GOOGLE_SCOPE || 'openid email profile',
    GOOGLE_AUTH_URL: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || 'https://accounts.google.com/o/oauth2/v2/auth',
    
    KAKAO_CLIENT_ID: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '207b40297d911436092906b7562cb701',
    KAKAO_REDIRECT_URI: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || 'http://localhost:3000/auth/callback',
    KAKAO_AUTH_URL: process.env.NEXT_PUBLIC_KAKAO_AUTH_URL || 'https://kauth.kakao.com/oauth/authorize',
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  };

  return requiredEnvVars;
};
