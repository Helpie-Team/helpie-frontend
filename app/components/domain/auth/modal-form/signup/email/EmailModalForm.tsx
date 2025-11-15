'use client';

import { useState } from 'react';
import { useEmailSignupStore } from '@/app/lib/stores/emailSignupStore';
import { useModalStore } from '@/app/lib/stores/modalStore';
import { sendEmailVerificationCode } from '@/app/api/auth/auth';
import { EmailInputStep } from './EmailInputStep';
import { VerificationCodeStep } from './VerificationCodeStep';
import { EmailSignupForm } from './EmailSignupForm';
import { WelcomeModal } from '@/app/components/common/WelcomeModal';
import { ConfirmModal } from '@/app/components/common/ConfirmModal';
import { useRouter } from 'next/navigation';

export default function EmailModalForm() {
  const { step, email, reset, setStep, setVerificationCode } = useEmailSignupStore();
  const { closeModal, openModal } = useModalStore();
  const router = useRouter();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleBack = () => {
    if (step === 'verification') {
      // 인증번호 단계에서 뒤로가기 -> 이메일 단계로
      setStep('email');
      setVerificationCode('');
    } else if (step === 'signup') {
      // 회원가입 단계에서 뒤로가기 -> 인증번호 단계로
      setStep('verification');
    } else {
      // 이메일 단계에서 뒤로가기 -> 회원가입 모달로
      reset();
      openModal('signup');
    }
  };

  const handleEmailNext = () => {
    // 이메일 입력 후 인증번호 단계로
    // 상태는 EmailInputStep에서 이미 업데이트됨
  };

  const handleVerificationNext = () => {
    // 인증번호 입력 후 회원가입 폼으로 이동
    setStep('signup');
  };

  const handleSignupSuccess = () => {
    // 회원가입 성공 시 환영 모달 표시
    setShowWelcomeModal(true);
  };

  const handleWelcomeModalSkip = () => {
    setShowWelcomeModal(false);
    reset();
    closeModal(); // 회원가입 모달 닫기
    router.push('/');
  };

  const handleWelcomeModalComplete = () => {
    setShowWelcomeModal(false);
    reset();
    closeModal(); // 회원가입 모달 닫기
    router.push('/new-user-info');
  };

  const handleResend = async (): Promise<boolean> => {
    const result = await sendEmailVerificationCode(email, 'EMAIL_AUTH');
    
    if (!result.success) {
      // 재전송 실패 시 에러 반환 (VerificationCodeStep에서 처리)
      return false;
    }
    
    return true;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // 웰컴 모달이 열려있으면 무시
    if (showWelcomeModal) return;
    
    // 배경 클릭 시 확인 모달 표시
    if (e.target === e.currentTarget) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    reset();
    closeModal();
    router.push('/');
  };

  const handleCancelClose = () => {
    setShowConfirmModal(false);
  };

  const getTitle = () => {
    switch (step) {
      case 'email':
        return '이메일로 회원가입';
      case 'verification':
        return '인증번호를 입력해주세요.';
      case 'signup':
        return '정보를 입력해주세요.';
      default:
        return '이메일로 회원가입';
    }
  };

  return (
    <>
      {!showWelcomeModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
        <div 
          className="bg-white rounded-[30px] p-8 w-full max-w-[540px] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800 text-xl"
              >
                ←
              </button>
              <h2 className="text-xl font-bold text-black">{getTitle()}</h2>
            </div>
            {step === 'signup' && (
              <button
                onClick={() => {
                  reset();
                  closeModal();
                }}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            )}
          </div>

          {/* 단계별 폼 */}
          {step === 'email' && <EmailInputStep onNext={handleEmailNext} />}
          {step === 'verification' && (
            <VerificationCodeStep 
              onNext={handleVerificationNext} 
              onResend={handleResend}
            />
          )}
          {step === 'signup' && (
            <EmailSignupForm onSuccess={handleSignupSuccess} />
          )}
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
