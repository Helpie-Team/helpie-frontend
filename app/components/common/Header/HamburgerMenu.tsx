'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Goal, Megaphone, Headset, Users, Globe, MessageCircle, ArrowRight, LucideIcon } from 'lucide-react';
import { useMyProfileInfo } from '@/app/hooks/my-page/useMyProfileInfo';
import { logout } from '@/app/api/auth/auth';
import { getRefreshToken, clearTokens } from '@/app/lib/utils/token';
import DefaultProfileImage from '@/public/images/profile_icon.png';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'About',
    items: [
      {
        href: '/about',
        icon: Goal,
        label: 'helpie란?',
      },
    ],
  },
  {
    title: '탐색',
    items: [
      {
        href: '/matching',
        icon: Users,
        label: '소모임',
      },
      {
        href: '/community',
        icon: Globe,
        label: '커뮤니티',
      },
      {
        href: '/chat',
        icon: MessageCircle,
        label: '채팅',
      },
    ],
  },
  {
    title: '고객센터',
    items: [
      {
        href: '/cs',
        icon: Megaphone,
        label: '공지사항',
      },
      {
        href: '/cs',
        icon: Headset,
        label: '문의하기',
      },
    ],
  },
];

const CHAT_HREF = '/chat';
const MY_PAGE_HREF = '/my-page';

const MENU_ITEM_LINK_CLASS = 'flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg transition-colors -mx-2 px-2';
const ICON_WRAPPER_CLASS = 'w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0';
const ICON_CLASS = 'text-key-200';
const SECTION_TITLE_CLASS = 'text-xs font-medium text-gray-500 mb-3';
const SECTION_CLASS = 'mb-6';

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { data: profile } = useMyProfileInfo(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
      onClose();
      router.replace('/');
      router.refresh();
    } catch (err) {
      console.error('로그아웃 실패:', err);
      clearTokens();
      onClose();
      router.replace('/');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getProfileImageUrl = () => {
    return profile?.imageUrl && profile.imageUrl !== 'NO_IMAGE' ? profile.imageUrl : DefaultProfileImage;
  };

  const getFilteredMenuSections = (): MenuSection[] => {
    if (isMobile) {
      return MENU_SECTIONS;
    }

    return MENU_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.href !== CHAT_HREF),
    }));
  };

  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = item.icon;
    return (
      <Link
        key={item.href + item.label}
        href={item.href}
        onClick={onClose}
        className={MENU_ITEM_LINK_CLASS}
      >
        <div className={ICON_WRAPPER_CLASS}>
          <IconComponent size={20} className={ICON_CLASS} />
        </div>
        <span className="text-sm font-semibold text-gray-900">{item.label}</span>
      </Link>
    );
  };

  const renderProfileSection = () => {
    if (!isMobile) {
      return null;
    }

    return (
      <Link
        href={MY_PAGE_HREF}
        onClick={onClose}
        className="w-full flex items-center gap-3 py-3 mb-4 hover:bg-gray-50 rounded-lg transition-colors -mx-2 px-2"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
          <Image
            src={getProfileImageUrl()}
            alt="profile"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900 truncate">{profile?.username || '사용자'}</span>
          </div>
          <div className="text-xs text-gray-500 truncate">{profile?.email || ''}</div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </Link>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-40 sm:hidden animate-fade-in"
        onClick={handleBackdropClick}
      />
      <div
        ref={menuRef}
        className="fixed sm:absolute top-0 sm:top-[68px] right-0 sm:right-[3rem] h-full sm:h-auto bg-white sm:rounded-xl shadow-lg z-50 w-[85%] sm:w-[321px] max-w-[400px] sm:max-w-none overflow-hidden flex flex-col animate-slide-in-right sm:animate-none"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900">모두보기</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="메뉴 닫기"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 flex-1">
          {renderProfileSection()}

          {isMobile && <div className="h-px bg-gray-200 mb-4" />}

          {getFilteredMenuSections().map((section) => (
            <div key={section.title} className={SECTION_CLASS}>
              <h3 className={SECTION_TITLE_CLASS}>{section.title}</h3>
              <div className={section.items.length > 1 ? 'flex flex-col gap-1' : ''}>
                {section.items.map(renderMenuItem)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center px-5 py-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-[109px] flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 rounded-3xl transition-colors disabled:opacity-50"
          >
            <span>{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;