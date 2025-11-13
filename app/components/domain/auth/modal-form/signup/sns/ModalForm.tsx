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
import { WelcomeModal } from '@/app/components/common/WelcomeModal';
import { ConfirmModal } from '@/app/components/common/ConfirmModal';
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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: email, // email 필드를 defaultValues로 설정
    },
  });

  const username = watch('username');
  const { validateUsername, isChecking: isCheckingUsername } = useUsernameValidation(500);

  // email이 변경되면 form 값도 업데이트
  useEffect(() => {
    setValue('email', email);
  }, [email, setValue]);

  useEffect(() => {
    if (username && username.length >= 2) {
      validateUsername(username).then(({ isValid, errorMessage }) => {
        setIsUsernameDuplicate(!isValid);
        
        if (!isValid && errorMessage) {
          setError('username', { 
            type: 'server', 
            message: errorMessage 
          });
        } else {
          // 검증 성공 시 에러 제거
          clearErrors('username');
        }
      });
    } else {
      setIsUsernameDuplicate(false);
      clearErrors('username');
    }
  }, [username, validateUsername, setError, clearErrors]);

  const { signup, isLoading } = useSignup({
    onSuccess: (accessToken, refreshToken) => {
      setTokens(accessToken, refreshToken);
      // 회원가입 성공 시 웰컴 모달 표시
      setShowWelcomeModal(true);
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

  const handleWelcomeModalSkip = () => {
    setShowWelcomeModal(false);
    closeModal(); // 회원가입 모달 닫기
    router.push('/');
  };

  const handleWelcomeModalComplete = () => {
    setShowWelcomeModal(false);
    closeModal(); // 회원가입 모달 닫기
    router.push('/new-user-info');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // 웰컴 모달이나 확인 모달이 열려있으면 무시
    if (showWelcomeModal || showConfirmModal) return;
    
    // 배경 클릭 시 확인 모달 표시
    if (e.target === e.currentTarget) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    closeModal();
    router.push('/');
  };

  const handleCancelClose = () => {
    setShowConfirmModal(false);
  };

  const canSubmit = 
    isValid && 
    agreements.privacyPolicy && 
    agreements.locationInfo && 
    !isLoading && 
    !isCheckingUsername &&
    !isUsernameDuplicate; 

  return (
    <>
      {!showWelcomeModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-white rounded-[30px] p-8 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
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
                className={`w-full py-4 rounded-3xl font-medium text-lg transition-colors ${
                  canSubmit
                    ? 'bg-grayScale-black text-white hover:bg-black-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? '처리 중...' : 'HELPie 시작하기'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 환영 모달 */}
      {showWelcomeModal && (
        <WelcomeModal 
          
          onSkip={handleWelcomeModalSkip}
          onComplete={handleWelcomeModalComplete}
        />
      )}

      {/* 확인 모달 */}
      {showConfirmModal && (
        <ConfirmModal
          title="회원가입을 중단하시겠어요?"
          message="지금까지 입력한 정보가 모두 사라집니다."
          onConfirm={handleConfirmClose}
          onCancel={handleCancelClose}
          confirmText="확인"
          cancelText="취소"
        />
      )}
    </>
  );
}