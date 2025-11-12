'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import HelpieLogoImage from '@/public/images/helpie-logo.png';
import { navItems } from '.';
import Modal from '../Modal/Modal';
import { useModalStore } from '../../../lib/stores/modalStore';
import { isAuthenticated, TOKEN_CHANGE_EVENT } from '../../../lib/utils/token';
import HamBurgerMenu from '@/public/icons/hamburger_icon.svg';
import DefaultProfileImage from '@/public/images/profile_icon.png';
import { useMyProfileInfo, MY_PROFILE_INFO_QUERY_KEY } from '@/app/hooks/my-page/useMyProfileInfo';
import { useQueryClient } from '@tanstack/react-query';
import MainLogoImage from '@/public/images/main_logo.png';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(isAuthenticated());
    const handleTokenChange = () => {
      const currentAuth = isAuthenticated();
      setHasToken(currentAuth);
      if (currentAuth) {
        queryClient.invalidateQueries({ queryKey: MY_PROFILE_INFO_QUERY_KEY });
      }
    };

    window.addEventListener(TOKEN_CHANGE_EVENT, handleTokenChange);
    window.addEventListener('storage', handleTokenChange);
    return () => {
      window.removeEventListener(TOKEN_CHANGE_EVENT, handleTokenChange);
      window.removeEventListener('storage', handleTokenChange);
    };
  }, [queryClient]);

  const {
    data: profile,
    isLoading: profileLoading,
    isFetching: profileFetching,
  } = useMyProfileInfo(hasToken);

  const isLoggedIn = hasToken && !!profile;
  const showSkeleton = hasToken && (profileLoading || profileFetching);

  const handleLoginClick = () => {
    openModal('login');
  };

  const handleSignupClick = () => {
    openModal('signup');
  };

  return (
    <>
      <header className="flex flex-row justify-between items-center">
        {navItems.map((item, i) => (
          <nav key={i} className="w-full flex flex-row items-center py-[16px] px-[3.5rem]">
            <ul className="flex flex-row justify-between w-full">
              <li className="flex flex-row items-center gap-2">
                <Link href={item.logo.link}>
                  <Image src={isHome ? MainLogoImage : HelpieLogoImage} alt={item.logo.alt} width={141} height={36} />
                </Link>
              </li>

              {showSkeleton && (
                <li className="flex flex-row items-center gap-4" aria-hidden="true">
                  <div className="w-12 h-5 rounded bg-gray-200 animate-pulse" />
                  <div className="w-12 h-5 rounded bg-gray-200 animate-pulse" />
                  <div className="w-10 h-5 rounded-full bg-gray-200 animate-pulse" />
                </li>
              )}

              {!showSkeleton && (
                <>
                  {isLoggedIn ? (
                    <li className="flex flex-row items-center gap-4">
                      <LanguageSelector />

                      <button type="button" className="cursor-pointer text-sm text-grayScale-600">
                        채팅
                      </button>

                      <button type="button" className="cursor-pointer text-sm text-grayScale-600">
                        알림
                      </button>

                      <button type="button" className="cursor-pointer p-1" aria-label="메뉴 열기">
                        <Image src={HamBurgerMenu} alt="hamburger_icon" width={24} height={24} />
                      </button>

                      <button
                        type="button"
                        className="w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                        aria-label="프로필 메뉴"
                      >
                        <Image
                          src={profile?.imageUrl ?? DefaultProfileImage}
                          alt="profile_image"
                          width={38}
                          height={38}
                        />
                      </button>
                    </li>
                  ) : (
                    <li className="flex flex-row items-center gap-3">
                      <LanguageSelector />
                      <span className="h-4 w-[1px] bg-grayScale-200" aria-hidden="true" />
                      <button
                        type="button"
                        className="rounded-full border border-grayScale-300 px-4 py-1.5 text-sm text-grayScale-title transition hover:bg-grayScale-100"
                        onClick={handleSignupClick}
                      >
                        회원가입
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-black px-4 py-1.5 text-sm text-white transition hover:opacity-60"
                        onClick={handleLoginClick}
                      >
                        로그인
                      </button>
                    </li>
                  )}
                </>
              )}
            </ul>
          </nav>
        ))}
      </header>
      <Modal />
    </>
  );
};

const LanguageSelector = () => (
  <button
    type="button"
    className="flex items-center gap-2 rounded-full border border-grayScale-200 px-3 py-1.5 text-sm text-grayScale-title transition hover:bg-grayScale-100"
  >
    <span className="font-medium">KR</span>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    
  </button>
);

export default Header;
