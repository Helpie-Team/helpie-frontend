'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Input } from '@/app/components/common/Input';
import { emailLoginSchema, type EmailLoginFormData } from '@/app/lib/schemas/auth';
import { emailLogin } from '@/app/api/auth/auth';
import { useModalStore } from '@/app/lib/stores/modalStore';
import { setTokens } from '@/app/lib/utils/token';
import { useRouter } from 'next/navigation';

export default function EmailSigninModalForm() {
  const { closeModal, openModal } = useModalStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const rememberMeValue = localStorage.getItem('rememberMe') || 'false';
  useEffect(() => {
    setRememberMe(rememberMeValue === 'true');
  }, [rememberMeValue]);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<EmailLoginFormData>({
    resolver: zodResolver(emailLoginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: EmailLoginFormData) => {
    setIsLoading(true);

    const result = await emailLogin(data.email, data.password);

    if (result.success && result.data) {
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

      closeModal();
      router.push('/');
    } else {
      setError('password', {
        type: 'server',
        message: result.message || '로그인에 실패했습니다.',
      });
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    openModal('login');
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('rememberMe', e.target.checked ? 'true' : 'false');
    setRememberMe(e.target.checked);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-[30px] p-8 w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-black">이메일로 로그인</h2>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1rem] space-y-6">
          <div className="flex flex-col gap-4">
          <Input
            {...register('email')}
            label="메일"
            type="email"
            placeholder="abcd@email.com"
            error={errors.email?.message}
          />

          <Input
            {...register('password')}
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            error={errors.password?.message}
            showPasswordToggle
          />
        </div>

        <div className="flex flex-col gap-4 justify-center text-center">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember-me" className="w-4 h-4 border-gray-500 rounded-[4px]" onChange={handleRememberMeChange} checked={rememberMe} />
            <label htmlFor="remember-me" className="text-sm text-gray-500">로그인 유지</label>
          </div>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`w-full py-4 rounded-3xl font-medium text-lg transition-colors ${
              isValid && !isLoading
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

