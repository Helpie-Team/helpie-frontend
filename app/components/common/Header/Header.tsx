'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import HelpieLogoImage from '@/public/images/helpie-logo.png';
import { navItems } from './index';
import Modal from '../Modal/Modal';
import { useModalStore } from '../../../lib/stores/modalStore';
import { isAuthenticated, TOKEN_CHANGE_EVENT } from '../../../lib/utils/token';
import { useMyProfileInfo, MY_PROFILE_INFO_QUERY_KEY } from '@/app/hooks/my-page/useMyProfileInfo';
import { useQueryClient } from '@tanstack/react-query';
import MainLogoImage from '@/public/images/main_logo.png';
import { usePathname } from 'next/navigation';
import LanguageSelector from './LanguageSelector';
import AuthButtons from './AuthButtons';
import UserMenu from './UserMenu';

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

  const handleProfileClick = () => {
    openModal('profile');
  };

  return (
    <>
      <header className="relative flex flex-row justify-between items-center">
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
                      <UserMenu profileImageUrl={profile?.imageUrl ?? undefined} onProfileClick={handleProfileClick} />
                    </li>
                  ) : (
                    <li className="flex flex-row items-center gap-3">
                      <LanguageSelector />
                      <span className="h-4 w-[1px] bg-grayScale-200" aria-hidden="true" />
                      <AuthButtons onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
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

export default Header;
