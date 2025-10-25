'use client';

import { useModalStore } from '../../../lib/stores/modalStore';
import GoogleLoginButton from '../../domain/auth/GoogleLoginButton';
import KakaoLoginButton from '../../domain/auth/KakaoLoginButton';

export default function Modal() {
  const { isOpen, modalType, closeModal, switchModal } = useModalStore();

  if (!isOpen || !modalType) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleClose = () => {
    closeModal();
  };

  const handleSwitchModal = () => {
    switchModal();
  };

  const handleEmailSignup = () => {
    // 이메일 회원가입 로직
    console.log('이메일 회원가입');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-[30px] p-8 w-full max-w-md mx-4 ">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-black">
            {modalType === 'login' ? '로그인' : '회원가입'}
          </h2>
          <button 
            onClick={handleClose}
            className="text-black hover:text-gray-700 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>
        
        {/* 로그인 버튼들 */}
        <div className="flex flex-col gap-7 space-y-4 mb-8">
          <div className='flex flex-col gap-2'>
          <GoogleLoginButton socialType="GOOGLE" />
          <KakaoLoginButton socialType="KAKAO" />
          </div>
          <button 
            onClick={handleEmailSignup}
            className="w-full bg-white border border-gray-300 rounded-3xl px-4 py-3 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            
            <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
            <span className="text-black font-medium">E-mail로 이용하기</span>
          </button>
        </div>
        
        {/* 하단 링크들 */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            {modalType === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleSwitchModal}
              className="text-black hover:text-gray-700 font-medium text-sm"
            >
              {modalType === 'login' ? '회원가입' : '로그인하기'}
            </button>
            <span className="text-gray-300">|</span>
            <button className="text-black hover:text-gray-700 font-medium text-sm">
              문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
