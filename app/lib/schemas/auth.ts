import { z } from 'zod';

// 소셜 회원가입 폼 스키마
export const signupSchema = z.object({
  username: z
    .string()
    .min(2, '2자 이상 입력해주세요.')
    .max(12, '12자 이하로 입력해주세요.')
    .regex(/^[a-zA-Z0-9가-힣]+$/, '한글, 영문, 숫자만 사용 가능합니다.'),
});

// 소셜 로그인 요청 스키마
export const socialLoginSchema = z.object({
  code: z.string().min(1, '인증 코드가 필요합니다.'),
  redirectUri: z.string().url('올바른 리다이렉트 URI가 필요합니다.'),
  socialType: z.enum(['GOOGLE', 'KAKAO']),
});

// 소셜 회원가입 요청 스키마
export const socialSignupSchema = z.object({
  socialAccessToken: z.string().min(1, '소셜 액세스 토큰이 필요합니다.'),
  username: z
    .string()
    .min(2, '2자 이상 입력해주세요.')
    .max(12, '12자 이하로 입력해주세요.')
    .regex(/^[a-zA-Z0-9가-힣]+$/, '한글, 영문, 숫자만 사용 가능합니다.'),
  socialType: z.enum(['GOOGLE', 'KAKAO']),
});

// 타입 추출
export type SignupFormData = z.infer<typeof signupSchema>;
export type SocialLoginRequest = z.infer<typeof socialLoginSchema>;
export type SocialSignupRequest = z.infer<typeof socialSignupSchema>;
