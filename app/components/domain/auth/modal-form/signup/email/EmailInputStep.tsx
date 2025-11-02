'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/app/components/common/Input';
import { emailSchema } from '@/app/lib/schemas/auth';
import { sendEmailVerificationCode } from '@/app/api/auth/auth';
import { useEmailSignupStore } from '@/app/lib/stores/emailSignupStore';
import { z } from 'zod';

const emailInputSchema = z.object({
  email: emailSchema,
});

type EmailInputFormData = z.infer<typeof emailInputSchema>;

interface EmailInputStepProps {
  onNext: () => void;
}

export function EmailInputStep({ onNext }: EmailInputStepProps) {
  const { setEmail, setStep } = useEmailSignupStore();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailInputFormData>({
    resolver: zodResolver(emailInputSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: EmailInputFormData) => {
    setIsLoading(true);
    setServerError(null);

    const result = await sendEmailVerificationCode(data.email);

    if (result.success) {
      setEmail(data.email);
      setStep('verification');
      onNext();
    } else {
      // 409 Conflict 또는 기타 에러 처리
      setServerError(result.message || '인증번호 전송에 실패했습니다.');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[10rem] space-y-6">
      <Input
        {...register('email')}
        label="이메일"
        type="email"
        placeholder="abcd@email.com"
        error={errors.email?.message || serverError || undefined}
      />

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={`w-full py-4 rounded-3xl font-medium text-lg transition-colors ${
          isValid && !isLoading
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? '전송 중...' : '인증번호 전송'}
      </button>
    </form>
  );
}

