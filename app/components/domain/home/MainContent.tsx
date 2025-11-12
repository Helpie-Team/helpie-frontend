import React from 'react';
import Image from 'next/image';
import MainContentImage from '@/public/images/main_image.png';

const MainContent = () => {
  return (
    <div className="w-full h-[592px]">
      <Image
        src={MainContentImage}
        alt="메인 콘텐츠"
        width={1920}
        className="w-full h-full object-center"
      />
    </div>
  );
};

export default MainContent;