'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HamBurgerMenu from '@/public/icons/hamburger_icon.svg';
import DefaultProfileImage from '@/public/images/profile_icon.png';
import HamburgerMenu from './HamburgerMenu';
import Alert from './Alert';
import { useUnreadCount, useQueryClient, UNREAD_COUNT_QUERY_KEY } from '@/app/hooks/notification/useNotification';
import { notificationWebSocket } from '@/app/lib/websocket/notificationWebSocket';
import { useUserStore } from '@/app/lib/stores/userStore';

interface UserMenuProps {
  profileImageUrl?: string;
  onProfileClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ profileImageUrl, onProfileClick }) => {
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const alertButtonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const { userInfo } = useUserStore();
  const { data: unreadCount = 0 } = useUnreadCount();

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

  const handleHamburgerClick = () => {
    setIsHamburgerMenuOpen(true);
  };

  const handleCloseHamburgerMenu = () => {
    setIsHamburgerMenuOpen(false);
  };

  const handleAlertClick = () => {
    setIsAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Link href="/chat" className="cursor-pointer text-sm text-grayScale-600">
          채팅
        </Link>

        <button
          ref={alertButtonRef}
          type="button"
          onClick={handleAlertClick}
          className="cursor-pointer text-sm text-grayScale-600 relative"
        >
          알림
          {unreadCount > 0 && (
            <span className="absolute -top-4 -right-4 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <button
          ref={hamburgerButtonRef}
          type="button"
          onClick={handleHamburgerClick}
          className="cursor-pointer p-1 relative"
          aria-label="메뉴 열기"
        >
          <Image src={HamBurgerMenu} alt="hamburger_icon" width={24} height={24} />
        </button>

        <button
          type="button"
          onClick={onProfileClick}
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
          aria-label="프로필 메뉴"
        >
          <Image
            src={profileImageUrl ?? DefaultProfileImage}
            alt="profile_image"
            width={38}
            height={38}
          />
        </button>
      </div>

      <HamburgerMenu 
        isOpen={isHamburgerMenuOpen} 
        onClose={handleCloseHamburgerMenu}
      />
      <Alert isOpen={isAlertOpen} onClose={handleCloseAlert} anchorRef={alertButtonRef} />
    </>
  );
};

export default UserMenu;

