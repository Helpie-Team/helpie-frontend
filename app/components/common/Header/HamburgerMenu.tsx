'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Goal, Megaphone, Headset, Users, Globe } from 'lucide-react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, anchorRef }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-[68px] right-[3rem] bg-white rounded-xl shadow-lg z-50 w-[321px]  overflow-hidden flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-base font-bold text-gray-900">메뉴</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="메뉴 닫기"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      {/* 메뉴 내용 */}
      <div className="overflow-y-auto px-5 py-3 flex-1">
        {/* 주요 메뉴 아이콘 */}
        <div className="flex gap-4 mb-6">
          <Link
            href="/matching"
            onClick={onClose}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <Users size={24} className="text-key-200" />
            </div>
            <span className="text-xs font-semibold text-gray-900">소모임</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="flex flex-col gap-2"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <Globe size={24} className="text-key-200" />
            </div>
            <span className="text-xs font-semibold text-gray-900">커뮤니티</span>
          </button>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-gray-200 mb-6" />

        {/* About 섹션 */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 mb-3">About</h3>
          <Link
            href="/about"
            onClick={onClose}
            className="flex items-center gap-3 py-2"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Goal size={24} className="text-gray-400" />
            </div>
            <span className="text-xs font-semibold text-gray-900">helpie란?</span>
          </Link>
        </div>

        {/* 고객센터 섹션 */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 mb-3">고객센터</h3>
          <div className="flex flex-col gap-1">
            <Link
              href="/support/notice"
              className="flex items-center gap-3 py-2"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Megaphone size={24} className="text-gray-400" />
              </div>
              <span className="text-xs font-semibold text-gray-900">공지사항</span>
            </Link>

            <Link
              href="/support/contact"
              className="flex items-center gap-3 py-2"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Headset size={24} className="text-gray-400" />
              </div>
              <span className="text-xs font-semibold text-gray-900">문의하기</span>
            </Link>
          </div>
        </div>
      </div>
      </div>
  );
};

export default HamburgerMenu;

