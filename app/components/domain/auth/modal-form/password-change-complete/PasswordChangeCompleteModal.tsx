'use client';

import { useModalStore } from '@/app/lib/stores/modalStore';
import { useRouter } from 'next/navigation';

export default function PasswordChangeCompleteModal() {
  const { closeModal } = useModalStore();
  const router = useRouter();

  const handleGoHome = () => {
    closeModal();
    router.push('/');
  };

  const handleLogin = () => {
    closeModal();
    router.push('/');
    // 로그인 모달을 열 수도 있음
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-[30px] sm:rounded-[30px] p-8 w-full sm:max-w-[540px] sm:mx-4 animate-slide-up">
        {/* 헤더 */}
        <div className="flex justify-center mb-8">
          <h2 className="text-xl font-bold text-black">비밀번호 변경 완료</h2>
        </div>

        {/* 완료 메시지 */}
        <div className="text-center mb-8">
          <p className="text-gray-600">비밀번호가 성공적으로 변경되었습니다.</p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleGoHome}
            className="flex-1 py-3 rounded-3xl font-medium text-base border-2 border-grayScale-300 bg-white text-grayScale-700 hover:bg-grayScale-100 transition-all"
          >
            홈으로
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 py-3 rounded-3xl font-medium text-base bg-gray-900 text-white hover:bg-gray-800 transition-all"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

