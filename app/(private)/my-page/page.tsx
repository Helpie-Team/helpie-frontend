'use client';

import React, { useMemo, useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import Layout from '@/app/components/my-page/Layout';
import MyActivity from '@/app/components/my-page/my-activity/MyActivity';
import MyMatching from '@/app/components/my-page/my-matching/MyMatching';
import MyOption from '@/app/components/my-page/my-option/MyOption';
import MyProfile from '@/app/components/my-page/my-profile/MyProfile';
import SideMenu from '@/app/components/my-page/side-menu/SideMenu';

type MenuKey = 'profile' | 'group' | 'activity' | 'settings';

const menuComponentMap: Record<MenuKey, React.ReactNode> = {
  profile: <MyProfile />,
  group: <MyMatching />,
  activity: <MyActivity />,
  settings: <MyOption />,
};

function MyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<MenuKey>('profile');
  const isInitialMount = useRef(true);

  // 초기 마운트 시에만 query parameter 확인
  useEffect(() => {
    if (isInitialMount.current) {
      const tab = searchParams.get('tab');
      if (tab === 'settings') {
        setActiveMenu('settings');
      }
      isInitialMount.current = false;
    }
  }, [searchParams]);

  // 메뉴 변경 핸들러 - query parameter 제거
  const handleMenuChange = (menu: MenuKey) => {
    setActiveMenu(menu);
    // query parameter가 있으면 제거
    if (searchParams.get('tab')) {
      router.replace('/my-page');
    }
  };

  const activeComponent = useMemo(() => menuComponentMap[activeMenu], [activeMenu]);

  const menuTabs = [
    { id: 'profile' as const, label: '나의 프로필' },
    { id: 'group' as const, label: '나의 소모임' },
    { id: 'activity' as const, label: '나의 활동' },
    { id: 'settings' as const, label: '설정' },
  ];

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-[1024px] gap-4 sm:gap-8">
        {/* 모바일 헤더 */}
        <div className="sm:hidden flex items-center gap-3 px-4 py-3 border-b border-grayScale-200">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold">마이페이지</h2>
        </div>

        {/* 데스크톱 헤더 */}
        <div className='hidden sm:flex flex-col gap-6'>
          <h2 className='text-3xl font-bold'>마이페이지</h2>
          <p className='h-[1px] w-full bg-grayScale-200' />
        </div>

        {/* 모바일 탭 네비게이션 */}
        <nav className="sm:hidden border-b border-grayScale-100">
          <div className="relative flex justify-between text-center text-sm text-grayScale-500">
            {menuTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleMenuChange(tab.id)}
                className={`w-full px-2 pb-3 transition-colors duration-200 ${
                  activeMenu === tab.id ? 'text-[var(--color-key-100)]' : 'hover:text-grayScale-title'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <span
              className={`pointer-events-none absolute bottom-0 h-[3px] transform rounded-full bg-[var(--color-key-100)] transition-transform duration-300 ease-in-out w-1/4 ${
                activeMenu === 'profile' ? 'translate-x-0' :
                activeMenu === 'group' ? 'translate-x-[100%]' :
                activeMenu === 'activity' ? 'translate-x-[200%]' :
                'translate-x-[300%]'
              }`}
              aria-hidden="true"
            />
          </div>
        </nav>

        {/* 데스크톱 레이아웃 */}
        <div className='hidden sm:flex flex-row gap-8'>
          <SideMenu activeMenu={activeMenu} onSelectMenu={handleMenuChange} />
          <section className="flex-1 bg-white">{activeComponent}</section>
        </div>

        {/* 모바일 콘텐츠 */}
        <section className="sm:hidden bg-white px-4 py-4">{activeComponent}</section>
      </div>
    </Layout>
  );
}

export default function MyPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="flex flex-col w-full max-w-[1024px] gap-4 sm:gap-8">
          <div className='hidden sm:flex flex-col gap-6'>
            <h2 className='text-3xl font-bold'>마이페이지</h2>
            <p className='h-[1px] w-full bg-grayScale-200' />
          </div>
          <div className="flex items-center justify-center py-20">
            <p className="text-body1 text-grayScale-500">로딩 중...</p>
          </div>
        </div>
      </Layout>
    }>
      <MyPageContent />
    </Suspense>
  );
}
