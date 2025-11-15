'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/app/components/common/Input';
import { useModalStore } from '@/app/lib/stores/modalStore';
import { changePassword } from '@/app/api/auth/auth';

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(12, '비밀번호는 12자 이하여야 합니다.')
    .regex(/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '소문자, 숫자, 기호가 포함된 8~12자리를 입력해주세요.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePasswordModal() {
  const { closeModal, openModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  // 이전 단계에서 전달받은 이메일을 가져오기
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('findAccountEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: PasswordFormData) => {
    if (!email) {
      setServerError('이메일 정보를 찾을 수 없습니다.');
      return;
    }

    setIsLoading(true);
    setServerError(null);

    const result = await changePassword(email, data.password, 'PW_AUTH');

    if (result.success) {
      // 이메일 정보 삭제
      sessionStorage.removeItem('findAccountEmail');
      openModal('password-change-complete');
    } else {
      setServerError(result.message || '비밀번호 변경에 실패했습니다.');
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-[30px] p-8 w-full max-w-[540px] mx-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-black">비밀번호 변경</h2>
        </div>

        {/* 비밀번호 변경 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <Input
              {...register('password')}
              label="새로운 비밀번호"
              type="password"
              placeholder="변경할 비밀번호를 입력해주세요."
              error={errors.password?.message}
              showPasswordToggle
            />
            <p className="text-sm text-gray-500 mt-1">
              소문자, 숫자, 기호가 포함된 8~12자리.
            </p>
          </div>

          <div>
            <Input
              {...register('confirmPassword')}
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 한번 더 입력해주세요."
              error={errors.confirmPassword?.message}
              showPasswordToggle
            />
          </div>

          {serverError && (
            <p className="text-red-500 text-sm">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`w-full py-4 rounded-3xl font-medium text-lg transition-colors ${
              isValid && !isLoading
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? '변경 중...' : '비밀번호 변경하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

