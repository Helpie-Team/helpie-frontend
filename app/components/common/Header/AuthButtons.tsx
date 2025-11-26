'use client';

import React from 'react';

interface AuthButtonsProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <button
        type="button"
        className="rounded-full border border-grayScale-300 px-4 py-1.5 text-sm text-grayScale-title transition hover:bg-grayScale-100"
        onClick={onSignupClick}
      >
        회원가입
      </button>
      <button
        type="button"
        className="rounded-full bg-black px-4 py-1.5 text-sm text-white transition hover:opacity-60"
        onClick={onLoginClick}
      >
        로그인
      </button>
    </div>
  );
};

export default AuthButtons;

