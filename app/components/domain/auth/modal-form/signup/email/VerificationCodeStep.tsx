'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Input } from '@/app/components/common/Input';
import { useEmailSignupStore } from '@/app/lib/stores/emailSignupStore';
import { verifyEmailCode } from '@/app/api/auth/auth';
import { z } from 'zod';

const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(6, '인증번호는 6자리입니다.')
    .max(6, '인증번호는 6자리입니다.')
    .regex(/^\d+$/, '숫자만 입력 가능합니다.'),
});

type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;

interface VerificationCodeStepProps {
  onNext: () => void;
  onResend: () => Promise<boolean>;
}

export function VerificationCodeStep({ onNext, onResend }: VerificationCodeStepProps) {
  const { email, setVerificationCode } = useEmailSignupStore();
  const [timer, setTimer] = useState(300); // 5분 = 300초
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<VerificationCodeFormData>({
    resolver: zodResolver(verificationCodeSchema),
    mode: 'onChange',
  });

  // 타이머 로직
  useEffect(() => {
    if (timer <= 0) return;

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
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendClick = async () => {
    setIsResending(true);
    setServerError(null);
    const success = await onResend();
    
    if (success) {
      setTimer(300); // 타이머 초기화
    } else {
      setServerError('인증번호 재전송에 실패했습니다.');
    }
    
    setIsResending(false);
  };

  const onSubmit = async (data: VerificationCodeFormData) => {
    setIsLoading(true);
    setServerError(null);

    const result = await verifyEmailCode(email, parseInt(data.code, 10), 'EMAIL_AUTH');

    if (result.success) {
      setVerificationCode(data.code);
      onNext();
    } else {
      setServerError(result.message || '유효한 인증번호를 입력해주세요.');
    }

    setIsLoading(false);
  };

  // 숫자만 입력되도록 필터링
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setValue('code', value, { shouldValidate: true });
    setServerError(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 이메일 필드 (읽기 전용) */}
      <Input
        label="메일"
        type="email"
        value={email}
        disabled
        className="bg-gray-50"
      />

      {/* 인증번호 필드 */}
      <div>
        <Input
          {...register('code', {
            onChange: handleCodeChange,
          })}
          label="인증번호"
          type="text"
          placeholder="123456"
          maxLength={6}
          inputMode="numeric"
          error={errors.code?.message || serverError || undefined}
        />

        {/* 도움말 텍스트 및 재전송 버튼 */}
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-500">
            {timer > 0 ? (
              <>
                6자 입력해주세요. ({formatTime(timer)})
              </>
            ) : (
              <span className="text-red-500">인증번호가 만료되었습니다.</span>
            )}
          </p>
          <button
            type="button"
            onClick={handleResendClick}
            disabled={isResending}
            className="text-sm text-black hover:text-gray-700 font-medium disabled:text-gray-400"
          >
            {isResending ? '전송 중...' : '재전송하기'}
          </button>
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        type="submit"
        disabled={!isValid || timer <= 0 || isLoading}
        className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${
          isValid && timer > 0 && !isLoading
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? '검증 중...' : '다음'}
      </button>
    </form>
  );
}

