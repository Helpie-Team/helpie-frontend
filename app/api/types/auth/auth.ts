// 인증 관련 타입 정의

export interface SocialAuthRequest {
  code: string;
  redirectUri: string;
  socialType: 'GOOGLE' | 'KAKAO';
}

export interface SocialSignupRequest {
  socialAccessToken: string;
  username: string;
  socialType: 'GOOGLE' | 'KAKAO';
}

// Google 프로필 rawData 구조
export interface GoogleProfileRawData {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
}

// Kakao 프로필 rawData 구조
export interface KakaoProfileRawData {
  connected_at: string;
  id: number;
  kakao_account: {
    email: string;
    email_needs_agreement: boolean;
    has_email: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
  };
  profile: {
    is_default_image: boolean;
    is_default_nickname: boolean;
  };
}

// 프로필 정보 (Google과 Kakao 모두 지원)
export interface Profile {
  code: string;
  rawData: GoogleProfileRawData | KakaoProfileRawData;
  socialType: string;
}

// 백엔드 응답 구조
export interface BackendAuthResponse {
  code?: string;
  data?: {
    socialAccessToken?: string;
    socialType?: string;
    profile?: Profile;
    user?: {
      id: string;
      email: string;
      name: string;
      profileImage?: string;
    };
  };
      accessToken?: string;
    refreshToken?: string;
  fieldErrors?: Record<string, string> | null;
  message?: string;
  timestamp?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: BackendAuthResponse;
}

export interface AuthError {
  success: false;
  message: string;
  error?: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}

export type AuthResult = AuthResponse | AuthError;

// 타입 가드 함수들
export function isGoogleProfile(profile: Profile): profile is Profile & { rawData: GoogleProfileRawData } {
  return profile.socialType === 'GOOGLE';
}

export function isKakaoProfile(profile: Profile): profile is Profile & { rawData: KakaoProfileRawData } {
  return profile.socialType === 'KAKAO';
}
