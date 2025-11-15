'use client';

import { useModalStore } from '../../../lib/stores/modalStore';
import GoogleLoginButton from '../../domain/auth/GoogleLoginButton';
import KakaoLoginButton from '../../domain/auth/KakaoLoginButton';
import EmailModalForm from '../../domain/auth/modal-form/signup/email/EmailModalForm';
import EmailSigninModalForm from '../../domain/auth/modal-form/signin/EmailSigninModalForm';
import ProfileModal from '../ProfileModal/ProfileModal';
import FindAccountModal from '../../domain/auth/modal-form/find-account/FindAccountModal';
import ChangePasswordModal from '../../domain/auth/modal-form/change-password/ChangePasswordModal';
import PasswordChangeCompleteModal from '../../domain/auth/modal-form/password-change-complete/PasswordChangeCompleteModal';
import KakaoIcon from '@/public/icons/kakao_icon.svg';
import GoogleIcon from '@/public/icons/google_icon.png';
import EmailIcon from '@/public/icons/email_icon.svg';
import Image from 'next/image';

export default function Modal() {
  const { isOpen, modalType, closeModal, switchModal, openModal } = useModalStore();

  if (!isOpen || !modalType) {
    return null;
  }

  if (modalType === 'email-signup') {
    return <EmailModalForm />;
  }

  // 이메일 로그인 모달이 열려있으면 EmailSigninModalForm을 렌더링
  if (modalType === 'email-login') {
    return <EmailSigninModalForm />;
  }

  // 프로필 모달
  if (modalType === 'profile') {
    return <ProfileModal />;
  }

  // 계정찾기 모달
  if (modalType === 'find-account') {
    return <FindAccountModal />;
  }

  // 비밀번호 변경 모달
  if (modalType === 'change-password') {
    return <ChangePasswordModal />;
  }

  // 비밀번호 변경 완료 모달
  if (modalType === 'password-change-complete') {
    return <PasswordChangeCompleteModal />;
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

  const handleEmailButtonClick = () => {
    if (modalType === 'login') {
      openModal('email-login');
    } else {
      openModal('email-signup');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 "
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-[540px] bg-white rounded-[30px] p-8 mx-4 ">
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
          <GoogleLoginButton socialType="GOOGLE" icon={GoogleIcon.src} />
          <KakaoLoginButton socialType="KAKAO" icon={KakaoIcon.src} />
          </div>

          {/* 이메일 버튼 */}
          <div className="flex flex-col gap-2">
          <button 
            onClick={handleEmailButtonClick}
            className="w-full bg-white border border-gray-300 rounded-3xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Image src={EmailIcon} alt="Email" width={24} height={24} />
            <span className="text-black font-medium">E-mail로 {modalType === 'login' ? '로그인' : '이용하기'}</span>
          </button>
        </div>
        </div>
        
        {/* 하단 링크들 */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            {modalType === 'login' ? '로그인에 문제가 있으신가요?' : '이미 계정이 있으신가요?'}
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleSwitchModal}
              className="text-black hover:text-gray-700 font-medium text-sm"
            >
              {modalType === 'login' ? '회원가입' : '로그인하기'}
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => {
                if (modalType === 'login') {
                  openModal('find-account');
                }
              }}
              className="text-black hover:text-gray-700 font-medium text-sm"
            >
              {modalType === 'login' ? '계정찾기' : '문의하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
