'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ArrowRightIcon from '@/public/icons/arrow_left.svg';
import MainContentImage from '@/public/images/main_image.png';
import MainContentMobileImage from '@/public/images/main_image_mobile.png';
import { useModalStore } from '@/app/lib/stores/modalStore';
import { isAuthenticated, TOKEN_CHANGE_EVENT } from '@/app/lib/utils/token';
import Link from 'next/link';
import { CATEGORY_ITEMS } from '@/app/lib/utils/mainCategories';



const MainContent = () => {
  const { openModal } = useModalStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateAuthState = () => setIsLoggedIn(isAuthenticated());
    updateAuthState();

    window.addEventListener(TOKEN_CHANGE_EVENT, updateAuthState);
    window.addEventListener('storage', updateAuthState);

    return () => {
      window.removeEventListener(TOKEN_CHANGE_EVENT, updateAuthState);
      window.removeEventListener('storage', updateAuthState);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
  }, []);
  
  const handleSignupClick = () => {
    openModal('signup');
  };

  const handleExploreClick = () => {
    router.push('/matching');
  };

  return (
    <main className="flex w-full flex-col bg-white">
      <section className="relative isolate w-full overflow-hidden h-[70vh] md:h-[80vh]">
        <div className="absolute inset-0 -z-10">
          <Image
            src={isMobile ?   MainContentMobileImage : MainContentImage}
            alt="HELPIe 메인 배경"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

        <div className="mx-auto flex max-w-[1160px] flex-col gap-8 px-4 py-20 text-white md:px-6 md:py-28 lg:py-32 xl:px-0">
          <div className="space-y-3 text-body1 text-gray-200 md:text-lg">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
              당신의 현지 적응 파트너, HELPie
            </span>
            <div className='flex flex-col gap-8'>
            <h1 className="text-[32px] font-bold font-pretendard leading-tight text-white md:text-4xl lg:text-[44px]">
              나에게 맞는 소모임을 찾고 계신가요?
            </h1>
            <div className='font-pretendard font-semibold'>
            <p className=" text-gray-100 md:text-lg">
              새로운 곳에서도 당신의 시작을 돕는 helper,
            </p>
            <p> 같은 지역의 친구들과 새로운 일상을 시작해보세요!</p>
            </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!isLoggedIn && (
              <button
                type="button"
                className="rounded-full bg-[#FF6B3D] px-8 py-3 text-base font-semibold text-white shadow-[0_22px_45px_rgba(255,107,61,0.35)] transition hover:bg-key-100"
                onClick={handleSignupClick}
              >
                로그인/회원가입
              </button>
            )}
            <button
              type="button"
              className="rounded-full border border-white/30 bg-white/15 px-8 py-3 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/25 hover:border-white/50"
            >
              <Link href="/about">
              더 알아보기
              </Link>
            </button>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-8 px-4 py-16 md:px-6 md:py-20 xl:px-0">
          <div className="space-y-2 text-left">
            <h2 className="text-2xl font-semibold text-grayScale-title md:text-[32px]">
            이런 소모임이 있어요! ( •̀∀•́ )✧
            </h2>
            <p className=" text-grayScale-500 text-balance md:text-lg">
              관심사를 공유하고, 새로운 친구를 만나고, 현지 생활 정보를 나눌 수 있는 다양한 모임을 만나보세요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {CATEGORY_ITEMS.map((item) => (
              <article
                key={item.title}
                className={`flex w-full h-full flex-col overflow-hidden rounded-[32px] border-[0.1px]  hover:border-[var(--color-key-100)] bg-white shadow-[0_20px_50px_rgba(248,200,180,0.22)] transition  hover:shadow-[0_24px_60px_rgba(255,180,120,0.32)]`}
              >
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <Image src={item.icon} alt={item.title} width={40} height={40} />
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-grayScale-title">{item.title}</h3>
                    <p className="text-sm leading-6 text-grayScale-500 text-balance">{item.description}</p>
                  </div>
                </div>
                <div className="relative h-[180px] w-full overflow-hidden bg-white rounded-t-[8px]">
                  <Image
                    src={item.image}
                    alt={`${item.title} 대표 이미지`}
                    fill
                    sizes="320px"
                    className="object-cover hover:scale-120 transition-all duration-600"
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center ">
            <button
              type="button"
              className="flex flex-row items-center gap-2 rounded-full bg-key-100 px-8 py-3 text-base font-semibold text-white shadow-[0_20px_40px_rgba(255,118,64,0.35)] transition  hover:bg-key-100/90"
              onClick={handleExploreClick}
            >
              <p className='flex justify-center items-center text-center '>소모임 둘러보기</p>
              <Image src={ArrowRightIcon} alt="arrow-right" width={14} height={14} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;