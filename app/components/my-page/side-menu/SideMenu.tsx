'use client';

import Image from 'next/image';
import React from 'react';

import ArrowRightIcon from '@/public/icons/gt_icon.svg';

const sideMenuItems = [
    {
        id: 'profile',
        title: '나의 프로필',
    },
    {
        id: 'group',
        title: '나의 소모임',
    },
    {
        id: 'activity',
        title: '나의 활동',
    },
    {
        id: 'settings',
        title: '설정',
    },
] as const;

type SideMenuKey = (typeof sideMenuItems)[number]['id'];

interface SideMenuProps {
  activeMenu: SideMenuKey;
  onSelectMenu: (menu: SideMenuKey) => void;
}

const SideMenu = ({ activeMenu, onSelectMenu }: SideMenuProps) => {
  return (
    <nav className="w-[199px]">
      <ul className="flex flex-col  overflow-hidden rounded-2xl border border-grayScale-200 bg-white">
        {sideMenuItems.map((item) => {
          const isActive = activeMenu === item.id;

          return (
            <li key={item.title} className="text-body1-regular">
                <div className='flex flex-col gap-1'>
              <button
                type="button"
                onClick={() => onSelectMenu(item.id)}
                className={`flex w-full items-center text-center justify-between px-4 py-5  text-[16px] transition-colors ${
                  isActive ? 'text-[var(--color-key-100)]' : 'text-grayScale-600'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.title}
                <Image src={ArrowRightIcon} alt="arrow-right" width={6} height={10} />
              </button>
              <p className='h-[1px] mx-4 bg-grayScale-200' />
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideMenu;