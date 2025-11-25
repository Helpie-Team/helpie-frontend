'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

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

export default function MyPage() {
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

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-[1024px] gap-8">
        <div className='flex flex-col gap-6'>
          <h2 className='text-3xl font-bold'>마이페이지</h2>
          <p className='h-[1px] w-full bg-grayScale-200' />
        </div>
        <div className='flex flex-row gap-8'>
        <SideMenu activeMenu={activeMenu} onSelectMenu={handleMenuChange} />
        <section className="flex-1  bg-white ">{activeComponent}</section>
        </div>
      </div>
    </Layout>
  );
}
