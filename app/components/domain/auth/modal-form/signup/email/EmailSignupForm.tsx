'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Input } from '@/app/components/common/Input';
import { emailSignupSchema, type EmailSignupFormData } from '@/app/lib/schemas/auth';
import { emailSignup } from '@/app/api/auth/auth';
import { useEmailSignupStore } from '@/app/lib/stores/emailSignupStore';
import { TermsAgreement } from '../../TermCheckbox';
import { useUsernameValidation } from '@/app/hooks/auth';
import { setTokens } from '@/app/lib/utils/token';

interface EmailSignupFormProps {
  onSuccess: () => void;
}

export function EmailSignupForm({ onSuccess }: EmailSignupFormProps) {
  const { email, setUsername } = useEmailSignupStore();
  const [agreements, setAgreements] = useState({
    all: false,
    privacyPolicy: false,
    locationInfo: false,
    marketing: false,
  });
  const [isUsernameDuplicate, setIsUsernameDuplicate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<EmailSignupFormData>({
    resolver: zodResolver(emailSignupSchema),
    mode: 'onChange',
  });

  const username = watch('username');
  const { validateUsername, isChecking: isCheckingUsername } = useUsernameValidation(500);

  useEffect(() => {
    if (username && username.length >= 2) {
      validateUsername(username).then(({ isValid, errorMessage }) => {
        setIsUsernameDuplicate(!isValid);
        
        if (!isValid && errorMessage) {
          setError('username', { 
            type: 'server', 
            message: errorMessage 
          });
        }
      });
    } else {
      setIsUsernameDuplicate(false);
    }
  }, [username, validateUsername, setError]);

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      privacyPolicy: checked,
      locationInfo: checked,
      marketing: checked,
    });
  };

  const handleAgreementChange = (field: keyof typeof agreements, checked: boolean) => {
    const newAgreements = { ...agreements, [field]: checked };
    newAgreements.all = newAgreements.privacyPolicy && newAgreements.locationInfo && newAgreements.marketing;
    setAgreements(newAgreements);
  };

  const handlePrivacyPolicyChange = (checked: boolean) => handleAgreementChange('privacyPolicy', checked);
  const handleLocationInfoChange = (checked: boolean) => handleAgreementChange('locationInfo', checked);
  const handleMarketingChange = (checked: boolean) => handleAgreementChange('marketing', checked);

  const onSubmit = async (data: EmailSignupFormData) => {
    if (!agreements.privacyPolicy || !agreements.locationInfo) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);
    const result = await emailSignup(email, data.username, data.password);

    if (result.success && result.data) {
      // username 저장
      setUsername(data.username);
      
      // 토큰 저장 (응답 구조에 따라 처리)
      const responseData = result.data as {
        accessToken?: string;
        refreshToken?: string;
        data?: {
          accessToken?: string;
          refreshToken?: string;
        };
      };
      
      const accessToken = responseData.accessToken || responseData.data?.accessToken;
      const refreshToken = responseData.refreshToken || responseData.data?.refreshToken;
      
      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
      }
      
      // 성공 콜백 호출 (환영 모달 표시)
      onSuccess();
    } else {
      setError('username', {
        type: 'server',
        message: result.message || '회원가입 중 오류가 발생했습니다.',
      });
    }

    setIsLoading(false);
  };

  const canSubmit = 
    isValid && 
    agreements.privacyPolicy && 
    agreements.locationInfo && 
    !isLoading && 
    !isCheckingUsername &&
    !isUsernameDuplicate;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 이메일 필드 */}
      <Input
        label="메일"
        type="email"
        value={email}
        disabled
        icon={
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        }
      />

      {/* 비밀번호 필드 */}
      <Input
        {...register('password')}
        label="비밀번호"
        type="password"
        placeholder="비밀번호 입력해주세요."
        error={errors.password?.message}
        helperText="소문자, 숫자, 기호가 포함된 8~12자리."
        showPasswordToggle
      />

      {/* 비밀번호 확인 필드 */}
      <Input
        {...register('confirmPassword')}
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 확인"
        error={errors.confirmPassword?.message}
        showPasswordToggle
      />

      {/* 별명 필드 */}
      <Input
        {...register('username')}
        label="별명"
        type="text"
        placeholder="별명을 입력해주세요"
        error={errors.username?.message}
        helperText="2자 - 12자 이내로 설정해주세요."
      />

      {/* 서비스 이용 동의 */}
      <TermsAgreement
        agreements={agreements}
        onAllAgreementChange={handleAllAgreement}
        onPrivacyPolicyChange={handlePrivacyPolicyChange}
        onLocationInfoChange={handleLocationInfoChange}
        onMarketingChange={handleMarketingChange}
      />

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-4 rounded-3xl font-medium text-lg transition-colors ${
          canSubmit
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? '처리 중...' : 'HELPie 시작하기'}
      </button>
    </form>
  );
}

