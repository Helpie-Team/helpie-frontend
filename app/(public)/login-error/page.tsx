'use client';

import Image from 'next/image';

import React from 'react';
import NotFoundImage from '@/public/images/404.png';
import { useRouter } from 'next/navigation';
import HelpieImage from '@/public/images/helpie.png';

export default function page() {
  const router = useRouter();
  const handleGoToHome = () => {
    router.push('/');
  };
  return (
    
    <div>
    <div className='flex flex-col gap-6 px-64 py-64'>
      <div className='flex flex-row gap-4 text-center items-center'>
      <h1 className='text-4xl font-medium'>앗, 로그인 후 이용해주세요</h1>
      <Image alt='helpie-image' src={HelpieImage} width={158} height={108} />
      </div>
      <div className='text-[30px]'>
      <p>요청하신 페이지가 존재하지 않거나, 로그인 이후 사용 가능 한 페이지 입니다.</p>
      <p>홈으로 돌아가 다시 시도해주세요.</p>
      </div>
      <button type='button' onClick={handleGoToHome} className='bg-key-100 text-white px-6 py-3 rounded-3xl w-[10rem]'>
        <p>홈으로 돌아가기</p>
      </button>
    </div>
    </div>
  );
}
