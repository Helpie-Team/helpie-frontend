'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { Menu, Bell } from 'lucide-react';
import HelpieLogoImage from '@/public/images/helpie-logo.png';
import { navItems } from './index';
import Modal from '../Modal/Modal';
import { useModalStore } from '../../../lib/stores/modalStore';
import { isAuthenticated, TOKEN_CHANGE_EVENT } from '../../../lib/utils/token';
import { useMyProfileInfo, MY_PROFILE_INFO_QUERY_KEY } from '@/app/hooks/my-page/useMyProfileInfo';
import { useQueryClient } from '@tanstack/react-query';
import MainLogoImage from '@/public/images/main_logo.png';
import { usePathname } from 'next/navigation';
import AuthButtons from './AuthButtons';
import UserMenu from './UserMenu';
import HamburgerMenu from './HamburgerMenu';
import Alert from './Alert';
import { useUnreadCount, UNREAD_COUNT_QUERY_KEY } from '@/app/hooks/notification/useNotification';
import { notificationWebSocket } from '@/app/lib/websocket/notificationWebSocket';
import { useUserStore } from '@/app/lib/stores/userStore';

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAlertOpen, setIsMobileAlertOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const alertButtonRef = useRef<HTMLButtonElement>(null);
  const { userInfo } = useUserStore();
  const { data: unreadCount = 0 } = useUnreadCount();

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

  useEffect(() => {
    if (!userInfo?.result?.id) return;

    // WebSocket 연결
    notificationWebSocket.connect(userInfo.result.id);

    // 알림 개수 업데이트 핸들러
    const unsubscribeCount = notificationWebSocket.onCount(() => {
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
    });

    return () => {
      unsubscribeCount();
    };
  }, [userInfo?.result?.id, queryClient]);

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

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileAlertClick = () => {
    setIsMobileAlertOpen(true);
  };

  const handleCloseMobileAlert = () => {
    setIsMobileAlertOpen(false);
  };

  return (
    <>
      <header className="relative flex flex-row justify-between items-center">
        {navItems.map((item, i) => (
          <nav key={i} className="w-full flex flex-row items-center py-[16px] px-4 sm:px-[3.5rem]">
            <ul className="flex flex-row justify-between w-full">
              <li className="flex flex-row items-center gap-2">
                <Link href={item.logo.link}>
                  <Image 
                    src={isHome ? MainLogoImage : HelpieLogoImage} 
                    alt={item.logo.alt} 
                    width={141} 
                    height={36}
                    className="w-auto h-6 sm:h-9"
                  />
                </Link>
              </li>

              {/* 모바일: 햄버거 메뉴 및 알림 아이콘 */}
              <li className="flex flex-row items-center gap-3 sm:hidden">
                {showSkeleton ? (
                  <div className="flex flex-row items-center gap-3" aria-hidden="true">
                    <div className="w-6 h-6 rounded bg-gray-200 animate-pulse" />
                    <div className="w-6 h-6 rounded bg-gray-200 animate-pulse" />
                  </div>
                ) : (
                  <>
                    {isLoggedIn && (
                      <button
                        ref={alertButtonRef}
                        type="button"
                        onClick={handleMobileAlertClick}
                        className="relative p-2 cursor-pointer"
                        aria-label="알림"
                      >
                        <Bell className="w-6 h-6 text-grayScale-700" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </button>
                    )}
                    <button
                      ref={hamburgerButtonRef}
                      type="button"
                      onClick={handleMobileMenuClick}
                      className="p-2 cursor-pointer"
                      aria-label="메뉴 열기"
                    >
                      <Menu className="w-6 h-6 text-grayScale-700" />
                    </button>
                  </>
                )}
              </li>

              {/* 데스크톱: 기존 레이아웃 */}
              <li className="hidden sm:flex flex-row items-center gap-4">
                {showSkeleton && (
                  <div className="flex flex-row items-center gap-4" aria-hidden="true">
                    <div className="w-12 h-5 rounded bg-gray-200 animate-pulse" />
                    <div className="w-12 h-5 rounded bg-gray-200 animate-pulse" />
                    <div className="w-10 h-5 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                )}

                {!showSkeleton && (
                  <>
                    {isLoggedIn ? (
                      <UserMenu profileImageUrl={profile?.imageUrl ?? undefined} onProfileClick={handleProfileClick} />
                    ) : (
                      <>
                        <span className="h-4 w-[1px] bg-grayScale-200" aria-hidden="true" />
                        <AuthButtons onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
                      </>
                    )}
                  </>
                )}
              </li>
            </ul>
          </nav>
        ))}
      </header>
      
      {/* 모바일 햄버거 메뉴 */}
      <HamburgerMenu 
        isOpen={isMobileMenuOpen} 
        onClose={handleCloseMobileMenu}
        anchorRef={hamburgerButtonRef}
      />
      
      {/* 모바일 알림 */}
      {isLoggedIn && (
        <Alert 
          isOpen={isMobileAlertOpen} 
          onClose={handleCloseMobileAlert} 
          anchorRef={alertButtonRef} 
        />
      )}
      
      <Modal />
    </>
  );
};

export default Header;
