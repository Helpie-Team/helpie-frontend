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
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [email, setEmail] = useState('');
  const rememberMeValue = sessionStorage.getItem('rememberMe') || 'false';
  
  useEffect(() => {
    setRememberMe(rememberMeValue === 'true');
  }, [rememberMeValue]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<EmailLoginFormData>({
    resolver: zodResolver(emailLoginSchema),
    mode: 'onChange',
  });

  const watchedEmail = watch('email');

  useEffect(() => {
    if (watchedEmail) {
      setEmail(watchedEmail);
      // 이메일이 변경되면 실패 횟수 초기화
      setFailedAttempts(0);
      setIsAccountLocked(false);
    }
  }, [watchedEmail]);

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

      // 성공 시 실패 횟수 초기화
      setFailedAttempts(0);
      setIsAccountLocked(false);
      closeModal();
      router.push('/');
    } else {
      const errorMessage = result.message || '로그인에 실패했습니다.';
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      // 에러 메시지에 따라 적절한 필드에 에러 표시
      if (errorMessage.includes('존재하지 않는') || errorMessage.includes('사용자') || errorMessage.includes('이메일')) {
        // 사용자 존재 여부 관련 에러는 이메일 필드에 표시
        setError('email', {
          type: 'server',
          message: errorMessage,
        });
      } else if (newFailedAttempts >= 5) {
        // 5회 이상 실패 시 계정 잠금
        setIsAccountLocked(true);
        setError('email', {
          type: 'server',
          message: '계정이 잠겼습니다.',
        });
        setError('password', {
          type: 'server',
          message: '계정이 잠겼습니다.',
        });
      } else {
        // 비밀번호 관련 에러는 비밀번호 필드에 표시
        setError('password', {
          type: 'server',
          message: errorMessage.includes('비밀번호') 
            ? `${errorMessage} (${newFailedAttempts}/5)`
            : `비밀번호가 틀렸습니다 (${newFailedAttempts}/5)`,
        });
      }
    }

    setIsLoading(false);
  };

  const handleFindAccount = () => {
    if (email) {
      sessionStorage.setItem('findAccountEmail', email);
    }
    openModal('find-account');
  };

  const handleBack = () => {
    openModal('login');
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sessionStorage.setItem('rememberMe', e.target.checked ? 'true' : 'false');
    setRememberMe(e.target.checked);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-[30px] p-8 w-full max-w-[540px] mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 text-xl"
            >
              ←
            </button>
            <h2 className="text-xl font-bold text-black">로그인</h2>
          </div>
          <button
            onClick={() => closeModal()}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            ×
          </button>
        </div>

        {/* 계정 잠금 알림 */}
        {isAccountLocked && (
          <div className="bg-[#F57575] flex flex-col text-center justify-center items-center gap-2 mb-6 p-4 bg-primary rounded-xl ">
            <p className="font-semibold text-white mb-2">계정이 잠겼습니다.</p>
            <p className="text-sm text-white">
              로그인 시도가 5회 초과되어 계정이 일시적으로 제한되었습니다. 이메일을 다시 확인하시거나, 계정찾기를 진행해주세요.
            </p>
          </div>
        )}

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1rem] space-y-6">
          <div className="flex flex-col gap-4">
            <Input
              {...register('email')}
              label="이메일"
              type="email"
              placeholder="abcd@email.com"
              error={errors.email?.message}
              className={isAccountLocked ? 'border-red-500' : ''}
            />

            <Input
              {...register('password')}
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              error={errors.password?.message}
              showPasswordToggle
              className={errors.password || isAccountLocked ? 'border-red-500' : ''}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="remember-me" 
                className="w-4 h-4 border-gray-500 rounded-[4px]" 
                onChange={handleRememberMeChange} 
                checked={rememberMe} 
              />
              <label htmlFor="remember-me" className="text-sm text-gray-500">로그인 유지</label>
            </div>
            <button
              type="button"
              onClick={handleFindAccount}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              계정찾기
            </button>
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading || isAccountLocked}
            className={`w-full py-4 rounded-3xl font-medium text-lg transition-colors ${
              isValid && !isLoading && !isAccountLocked
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

