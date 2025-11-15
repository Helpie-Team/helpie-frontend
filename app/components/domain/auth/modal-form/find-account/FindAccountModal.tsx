'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useModalStore } from '@/app/lib/stores/modalStore';
import { sendEmailVerificationCode, verifyEmailCode } from '@/app/api/auth/auth';
import { ConfirmModal } from '@/app/components/common/ConfirmModal/ConfirmModal';

const findAccountSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  code: z.string().optional(),
}).refine((data) => {
  // 이메일이 전송된 후에는 인증번호가 필수
  return !data.code || data.code.length === 6;
}, {
  message: '인증번호 6자리를 입력해주세요.',
  path: ['code'],
});

type FindAccountFormData = z.infer<typeof findAccountSchema>;

export default function FindAccountModal() {
  const { closeModal, openModal } = useModalStore();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timer, setTimer] = useState(300); // 5분 = 300초

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FindAccountFormData>({
    resolver: zodResolver(findAccountSchema),
    mode: 'onChange',
  });

  const watchedEmail = watch('email');
  const watchedCode = watch('code');

  // 타이머 로직 - 인증번호 인풋이 렌더링될 때 시작
  useEffect(() => {
    if (!emailSent || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [emailSent, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    if (emailSent) {
      // 인증번호 단계에서 뒤로가기 시 이메일 입력으로 돌아가기
      setEmailSent(false);
      setTimer(300);
      setValue('code', '');
      setServerError(null);
    } else {
      // 이메일 입력 단계에서 뒤로가기 시 일반 로그인 모달로 이동
      openModal('login');
    }
  };

  const handleSendEmail = async () => {
    if (!watchedEmail) return;
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(watchedEmail)) {
      setServerError('올바른 이메일을 입력해주세요.');
      return;
    }

    setIsSending(true);
    setServerError(null);

    const result = await sendEmailVerificationCode(watchedEmail, "PW_AUTH");

    if (result.success) {
      setEmail(watchedEmail);
      setTimer(300); // 타이머를 먼저 설정
      setEmailSent(true); // 그 다음 이메일 전송 상태 변경 (이렇게 하면 타이머가 시작됨)
    } else {
      setServerError(result.message || '인증번호 전송에 실패했습니다.');
    }

    setIsSending(false);
  };

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    setServerError(null);

    const result = await sendEmailVerificationCode(email, "PW_AUTH");

    if (result.success) {
      setTimer(300);
      setValue('code', '');
    } else {
      setServerError(result.message || '인증번호 재전송에 실패했습니다.');
    }

    setIsResending(false);
  };

  const onSubmit = async (data: FindAccountFormData) => {
    if (!emailSent || !data.code) return;

    setIsLoading(true);
    setServerError(null);

    const result = await verifyEmailCode(email, parseInt(data.code, 10), 'PW_AUTH');

    if (result.success) {
      // 이메일을 sessionStorage에 저장하여 비밀번호 변경 모달로 전달
      sessionStorage.setItem('findAccountEmail', email);
      openModal('change-password');
    } else {
      setServerError(result.message || '유효한 인증번호를 입력해주세요.');
    }

    setIsLoading(false);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setValue('code', value, { shouldValidate: true });
    setServerError(null);
  };


  const handleBackdropClick = (e: React.MouseEvent) => {
    // 확인 모달이 열려있으면 무시
    if (showConfirmModal) return;
    
    // 배경 클릭 시 확인 모달 표시
    if (e.target === e.currentTarget) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    closeModal();
  };

  const handleCancelClose = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        <div 
          className="bg-white rounded-[30px] p-6 w-full max-w-[540px] mx-4 h-[535px] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 text-xl"
            >
              ←
            </button>
            <h2 className="text-xl font-bold text-black">계정찾기</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            {/* 필드 영역 - 스크롤 가능 */}
            <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
              {/* 이메일 필드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <div className="relative">
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="abcd@email.com"
                    disabled={emailSent}
                    className={`
                      w-full px-4 py-3 pr-24 border rounded-xl
                      ${errors.email || serverError ? 'border-red-500' : 'border-gray-300'}
                      ${emailSent ? 'bg-gray-50 text-gray-600' : 'bg-white'}
                      focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
                    `}
                  />
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={!watchedEmail || isSending || emailSent || !!errors.email}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      watchedEmail && !isSending && !emailSent && !errors.email
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSending ? '전송 중...' : '전송'}
                  </button>
                </div>
                <div className="h-5 mt-1">
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* 인증번호 필드 - 이메일 전송 후 표시 */}
              {emailSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">인증번호</label>
                  <div className="relative">
                    <input
                      {...register('code', {
                        onChange: handleCodeChange,
                      })}
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      inputMode="numeric"
                      className={`
                        w-full px-4 py-3 pr-24 border rounded-xl
                        ${errors.code || serverError ? 'border-red-500' : 'border-gray-300'}
                        bg-white
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      `}
                    />
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-sm font-medium text-black hover:text-gray-700 disabled:text-gray-400 whitespace-nowrap"
                    >
                      {isResending ? '전송 중...' : '재전송하기'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1 h-5">
                    <p className="text-sm text-gray-500">
                      {timer > 0 ? (
                        <>6자 입력해주세요. ({formatTime(timer)})</>
                      ) : (
                        <span className="text-red-500">인증번호가 만료되었습니다.</span>
                      )}
                    </p>
                  </div>
                  <div className="h-5 mt-1">
                    {(errors.code || serverError) && (
                      <p className="text-red-500 text-sm">
                        {errors.code?.message || serverError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 다음 버튼 - 하단 고정 */}
            <div className="mt-auto pt-6">
              <button
                type="submit"
                disabled={!emailSent || !watchedCode || watchedCode.length !== 6 || isLoading}
                className={`w-full py-4 rounded-3xl font-medium text-lg transition-colors ${
                  emailSent && watchedCode && watchedCode.length === 6 && !isLoading
                    ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? '인증 중...' : '다음'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          title="계정찾기를 취소하시겠습니까?"
          message="입력하신 정보가 저장되지 않습니다."
          onConfirm={handleConfirmClose}
          onCancel={handleCancelClose}
          confirmText="확인"
          cancelText="취소"
        />
      )}
    </>
  );
}

