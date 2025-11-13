'use client';

import React, { useMemo, useState } from 'react';

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
  const [activeMenu, setActiveMenu] = useState<MenuKey>('profile');

  const activeComponent = useMemo(() => menuComponentMap[activeMenu], [activeMenu]);

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-[1024px] gap-8">
        <div className='flex flex-col gap-6'>
          <h2 className='text-3xl font-bold'>마이페이지</h2>
          <p className='h-[1px] w-full bg-grayScale-200' />
        </div>
        <div className='flex flex-row gap-8'>
        <SideMenu activeMenu={activeMenu} onSelectMenu={setActiveMenu} />
        <section className="flex-1  bg-white ">{activeComponent}</section>
        </div>
      </div>
    </Layout>
  );
}
