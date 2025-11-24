'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HamBurgerMenu from '@/public/icons/hamburger_icon.svg';
import DefaultProfileImage from '@/public/images/profile_icon.png';
import HamburgerMenu from './HamburgerMenu';

interface UserMenuProps {
  profileImageUrl?: string;
  onProfileClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ profileImageUrl, onProfileClick }) => {
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const handleHamburgerClick = () => {
    setIsHamburgerMenuOpen(true);
  };

  const handleCloseHamburgerMenu = () => {
    setIsHamburgerMenuOpen(false);
  };

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Link href="/chat" className="cursor-pointer text-sm text-grayScale-600">
          채팅
        </Link>

        <button type="button" className="cursor-pointer text-sm text-grayScale-600">
          알림
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
        anchorRef={hamburgerButtonRef}
      />
    </>
  );
};

export default UserMenu;

