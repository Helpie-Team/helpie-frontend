'use client';

import Image from 'next/image';

import React from 'react';
import NotFoundImage from '@/public/images/404.png';
import { useRouter } from 'next/navigation';
import HelpieImage from '@/public/images/helpie.png';

export default function NotFound() {
  const router = useRouter();
  const handleGoToHome = () => {
    router.push('/');
  };
  return (
    
    <div>
    <div className='flex flex-col gap-6 px-64 py-64'>
      <Image src={NotFoundImage} alt='not-found' width={392} height={187} />
      <div className='flex flex-row gap-4 text-center items-center'>
      <h1 className='text-4xl font-medium'>앗, 찾으시는 페이지가 존재하지 않아요</h1>
      <Image alt='helpie-image' src={HelpieImage} width={158} height={108} />
      </div>
      <div className='text-[30px]'>
      <p>요청하신 페이지가 존재하지 않거나, 주소가 잘못 입력되었습니다.</p>
      <p>홈으로 돌아가 다시 시도해주세요.</p>
      </div>
      <button type='button' onClick={handleGoToHome} className='bg-key-100 text-white px-6 py-3 rounded-3xl w-[10rem]'>
        <p>홈으로 돌아가기</p>
      </button>
    </div>
    </div>
  );
}
