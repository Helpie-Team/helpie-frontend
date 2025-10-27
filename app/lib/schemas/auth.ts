import { z } from 'zod';

// 이메일 스키마
export const emailSchema = z
  .string()
  .max(100, '이메일은 100자 이하로 입력해주세요.')
  .email('올바른 이메일 형식이 아닙니다.')
  .regex(
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    '이메일 형식이 올바르지 않습니다. (예: user@example.com)'
  )
  .refine(
    (value) => {
      const parts = value.split('@');
      const username = parts[0];
      const domain = parts[1];
      return username.length <= 30 && domain.length <= 70;
    },
    {
      message: '‘example@email.com’ 과 같은 형식으로 입력해주세요.',
    }
  );

// 별명 스키마
export const usernameSchema = z
  .string()
  .min(2, '2자 이상 입력해주세요.')
  .max(12, '12자 이하로 입력해주세요.')
  .regex(/^[a-zA-Z0-9가-힣]+$/, '한글, 영문, 숫자만 사용 가능합니다.');

// 비밀번호 스키마
export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 8자 이상 입력해주세요.')
  .max(12, '비밀번호는 12자 이하로 입력해주세요.')
  .regex(
    /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/,
    '영문, 숫자, 특수문자만 사용 가능합니다.'
  );

// 소셜 회원가입 폼 스키마 (email은 소셜 로그인에서 받아오므로 폼에서 제외)
export const signupSchema = z.object({
  username: usernameSchema,
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
  username: usernameSchema,
  email: emailSchema,
  socialType: z.enum(['GOOGLE', 'KAKAO']),
});

// 타입 추출
export type SignupFormData = z.infer<typeof signupSchema>;
export type SocialLoginRequest = z.infer<typeof socialLoginSchema>;
export type SocialSignupRequest = z.infer<typeof socialSignupSchema>;
