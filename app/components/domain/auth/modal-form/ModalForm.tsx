'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useModalStore } from '../../../../lib/stores/modalStore';
import { socialSignup } from '../../../../api/auth/auth';
import { signupSchema, type SignupFormData } from '../../../../lib/schemas/auth';
import { setTokens } from '../../../../lib/utils/token';

interface ModalFormProps {
  email: string;
  socialAccessToken: string;
  socialType: 'GOOGLE' | 'KAKAO';
}

export default function ModalForm({ email, socialAccessToken, socialType}: ModalFormProps) {
  const { closeModal } = useModalStore();
  const [agreements, setAgreements] = useState({
    all: false,
    required1: false,
    required2: false,
    optional: false,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  // useMutation을 사용한 회원가입 처리
  const signupMutation = useMutation({
    mutationFn: socialSignup,
    onSuccess: (result) => {
      if (result.success) {
        closeModal();
        
        // 토큰을 쿠키와 localStorage에 저장
        if (result.data?.accessToken && result.data?.refreshToken) {
          setTokens(result.data.accessToken, result.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(result.data.data?.user));
        }
        
        // 메인 페이지로 리다이렉트
        window.location.href = '/';
      } else {
        // 서버에서 반환된 에러 메시지 처리
        if (result.message) {
          setError('username', { 
            type: 'manual', 
            message: result.message 
          });
        }
      }
    },
    onError: (error: Error) => {
      
      // 409 에러 (중복 사용자명) 처리
      if (error.message === '409') {
        setError('username', { 
          type: 'manual', 
          message: '이미 사용 중인 별명입니다. 다른 별명을 입력해주세요.' 
        });
      } else {
        setError('username', { 
          type: 'manual', 
          message: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' 
        });
      }
    },
  });

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      required1: checked,
      required2: checked,
      optional: checked,
    });
  };

  const handleIndividualAgreement = (key: keyof typeof agreements, checked: boolean) => {
    const newAgreements = { ...agreements, [key]: checked };
    newAgreements.all = newAgreements.required1 && newAgreements.required2 && newAgreements.optional;
    setAgreements(newAgreements);
  };

  const onSubmit = (data: SignupFormData) => {
    if (!agreements.required1 || !agreements.required2) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    signupMutation.mutate({
      socialAccessToken,
      username: data.username,
      socialType,
    });
  };

  const canSubmit = isValid && agreements.required1 && agreements.required2 && !signupMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-[30px] p-8 w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-800"
            >
              ←
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <h2 className="text-xl font-bold text-black">정보를 입력해주세요.</h2>
          </div>
          <div className="flex items-center gap-2">
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 이메일 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">메일</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* 별명 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">별명</label>
            <input
              {...register('username')}
              type="text"
              placeholder="별명을 입력해주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">2자 - 12자 이내로 설정해주세요.</p>
          </div>

          {/* 서비스 이용 동의 */}
    <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">서비스 이용 동의</h3>
            
            {/* 모두동의 */}
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="all"
                checked={agreements.all}
                onChange={(e) => handleAllAgreement(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="all" className="ml-2 text-sm font-medium text-gray-700">
                모두동의
              </label>
            </div>

            {/* 개별 약관들 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required1"
                    checked={agreements.required1}
                    onChange={(e) => handleIndividualAgreement('required1', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="required1" className="ml-2 text-sm text-gray-700">
                    필수 개인정보 수집/이용에 관한 약관
                  </label>
                </div>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">필수</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required2"
                    checked={agreements.required2}
                    onChange={(e) => handleIndividualAgreement('required2', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="required2" className="ml-2 text-sm text-gray-700">
                    필수 위치정보 이용 약관
                  </label>
                </div>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">필수</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="optional"
                    checked={agreements.optional}
                    onChange={(e) => handleIndividualAgreement('optional', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="optional" className="ml-2 text-sm text-gray-700">
                    선택 마케팅 및 서비스 이용 알림 동의
                  </label>
                </div>
                <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">선택</span>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${
              canSubmit
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {signupMutation.isPending ? '처리 중...' : 'HELPie 시작하기'}
          </button>
        </form>
      </div>
    </div>
  );
}