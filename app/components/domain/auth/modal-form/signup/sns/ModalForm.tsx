'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useModalStore } from '../../../../../../lib/stores/modalStore';
import { signupSchema, type SignupFormData } from '../../../../../../lib/schemas/auth';
import { setTokens } from '../../../../../../lib/utils/token';
import { useSignup, useUsernameValidation } from '../../../../../../hooks/auth';
import { TermsAgreement } from '../../TermCheckbox';
import { Input } from '../../../../../common/Input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ModalFormProps {
  email: string;
  socialAccessToken: string;
  socialType: 'GOOGLE' | 'KAKAO';
  icon: string;
}

export default function ModalForm({ email, socialAccessToken, socialType, icon }: ModalFormProps) {
  const { closeModal } = useModalStore();
  const router = useRouter();
  const [agreements, setAgreements] = useState({
    all: false,
    privacyPolicy: false,
    locationInfo: false,
    marketing: false,
  });
  const [isUsernameDuplicate, setIsUsernameDuplicate] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
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

  const { signup, isLoading } = useSignup({
    onSuccess: (accessToken, refreshToken) => {
      setTokens(accessToken, refreshToken);
      closeModal();
      router.push('/');
    },
    onError: (error) => {
      setError('username', { 
        type: 'server', 
        message: error.message || '회원가입 중 오류가 발생했습니다.' 
      });
    },
  });

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

  const onSubmit = (data: SignupFormData) => {
    if (!agreements.privacyPolicy || !agreements.locationInfo) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    signup({
      socialAccessToken,
      username: data.username,
      email: email, 
      socialType,
    });
  };

  const handleCloseModal = () => {
    closeModal();
    router.push('/');
  };

  const canSubmit = 
    isValid && 
    agreements.privacyPolicy && 
    agreements.locationInfo && 
    !isLoading && 
    !isCheckingUsername &&
    !isUsernameDuplicate; 

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-[30px] p-8 w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCloseModal}
              className="text-gray-600 hover:text-gray-800"
            >
              ←
            </button>
            {socialType === 'GOOGLE' && (
              <Image src={icon as string} alt="Google" width={20} height={20} />
            )}
            {socialType === 'KAKAO' && (
              <Image src={icon} alt="Kakao" width={20} height={20} />
            )}
            <h2 className="text-xl font-bold text-black">정보를 입력해주세요.</h2>
          </div>
          <div className="flex items-center gap-2">
          </div>
        </div>

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
            className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${
              canSubmit
                ? 'bg-black-600 text-white hover:bg-black-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? '처리 중...' : 'HELPie 시작하기'}
          </button>
        </form>
      </div>
    </div>
  );
}