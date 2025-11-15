'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useModalStore } from '../../../lib/stores/modalStore';
import { useMyProfileInfo } from '@/app/hooks/my-page/useMyProfileInfo';
import { logout } from '@/app/api/auth/auth';
import { getRefreshToken, clearTokens } from '@/app/lib/utils/token';
import DefaultProfileImage from '@/public/images/profile_icon.png';

export default function ProfileModal() {
  const { closeModal } = useModalStore();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: profile } = useMyProfileInfo(true);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleClose = () => {
    closeModal();
  };

  const handleProfileClick = () => {
    closeModal();
    router.push('/my-page');
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logout(refreshToken);
      } else {
        clearTokens();
      }
      closeModal();
      router.replace('/');
      router.refresh();
    } catch (err) {
      console.error('로그아웃 실패:', err);
      clearTokens();
      closeModal();
      router.replace('/');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="absolute top-[68px] right-[3.5rem] bg-white rounded-[20px] shadow-lg w-[320px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-grayScale-200">
          <h2 className="text-lg font-semibold text-grayScale-title">My</h2>
          <button
            onClick={handleClose}
            className="text-grayScale-600 hover:text-grayScale-title transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Profile Section */}
        <button
          onClick={handleProfileClick}
          className="w-full px-5 py-4 flex items-center gap-3 hover:bg-grayScale-50 transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-grayScale-100 flex items-center justify-center">
            <Image
              src={profile?.imageUrl ?? DefaultProfileImage}
              alt="profile"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="font-semibold text-base text-grayScale-title truncate">
              {profile?.username || '사용자'}
            </div>
            <div className="text-sm text-grayScale-600 truncate">
              {profile?.email || ''}
            </div>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 text-grayScale-400"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Logout Button */}
        <div className="px-5 py-4 border-t border-grayScale-200">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-grayScale-600 hover:text-grayScale-title transition-colors disabled:opacity-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

