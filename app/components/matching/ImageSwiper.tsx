import mainBanner from '@/public/images/mainBanner.png';
import Image from 'next/image';
import React from 'react';

export default function ImageSwiper() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <h1 className="text-h1 text-grayScale-700 w-[1000px]">다양한 소모임을 둘러보고 참여해보세요!</h1>
      <div className="w-[1000px] h-[90px] relative rounded-2xl">
        <Image
          src={mainBanner}
          alt="Main Swiper"
          fill
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
}