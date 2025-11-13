'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { navItems } from '.';
import Modal from '../Modal/Modal';
import { useModalStore } from '../../../lib/stores/modalStore';
import { useUserInfo } from '../../../hooks/auth';
import { isAuthenticated } from '../../../lib/utils/token';
import HamBurgerMenu from '@/public/icons/hamburger_icon.svg';

const Header = () => {
  const { openModal } = useModalStore();
  const { userInfo, isLoading } = useUserInfo();
  const isLoggedIn = isAuthenticated() && !!userInfo;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoginClick = () => {
    openModal('login');
  };

  const handleSignupClick = () => {
    openModal('signup');
  };

  return (
    <>
      <header className="flex flex-row justify-center ">
        {navItems.map((item, i) => (
          <nav
            key={i}
            className="w-[64rem] flex flex-row items-center py-[16px] px-[3.5rem]"
          >
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-row items-center gap-2">
                {item.logo.image && (
                  <div className="w-[38px] h-[38px]">
                    <Image src={item.logo.image} alt={item.logo.alt} width={38} height={38} />
                  </div>
                )}

                <Link href={item.logo.link}>{item.logo.text}</Link>
              </div>

              {mounted && !isLoading && (
                <>
                  {isLoggedIn ? (
                    <div className="flex flex-row items-center gap-4">
                      {/* 언어 선택기 */}
                      <div className="flex flex-row items-center gap-1 cursor-pointer">
                        <span className="text-sm">KR</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 4.5L6 7.5L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      
                      {/* 채팅 */}
                      <span className="cursor-pointer text-sm">채팅</span>
                      
                      {/* 알림 */}
                      <span className="cursor-pointer text-sm">알림</span>
                      
                      {/* 햄버거 메뉴 */}
                      <button className="cursor-pointer p-1">
                        <Image src={HamBurgerMenu} alt="hamburger_icon" width={24} height={24} />
                      </button>
                      
                      {/* 프로필 아바타 */}
                      <div className="w-[38px] h-[38px] rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden">
                        {userInfo?.result?.username ? (
                          <span className="text-sm font-medium text-gray-600">
                            {userInfo.result.username.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-600">U</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-3">
                      <div className="cursor-pointer" onClick={handleLoginClick}>
                        {item.signin}
                      </div>
                      <div className="cursor-pointer" onClick={handleSignupClick}>
                        {item.signup}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </nav>
        ))}
      </header>
      <Modal />
    </>
  );
};

export default Header;
