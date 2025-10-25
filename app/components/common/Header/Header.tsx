'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { navItems } from '.';
import Modal from '../Modal/Modal';
import { useModalStore } from '../../../lib/stores/modalStore';

const Header = () => {
  const { openModal } = useModalStore();

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
            <ul className="flex flex-row justify-between w-full">
              <div className="flex flex-row items-center gap-2">
                {item.logo.image && (
                  <div className="w-[38px] h-[38px]">
                    <Image src={item.logo.image} alt={item.logo.alt} width={38} height={38} />
                  </div>
                )}

                <Link href={item.logo.link}>{item.logo.text}</Link>
              </div>
              <div className="flex flex-row items-center gap-3">
                <li className="cursor-pointer" onClick={handleLoginClick}>
                  {item.signin}
                </li>
                <li className="cursor-pointer" onClick={handleSignupClick}>
                  {item.signup}
                </li>
              </div>
            </ul>
          </nav>
        ))}
      </header>
      <Modal />
    </>
  );
};

export default Header;
