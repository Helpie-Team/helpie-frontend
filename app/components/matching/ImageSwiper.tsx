"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

// 배너 슬라이드 데이터
const slides = [
  {
    id: 1,
    image: "/images/mainBanner.png",
    alt: "helpie 메인 배너",
  },
  {
    id: 2,
    image: "/images/Banner2.png",
    alt: "믿고 참여할 수 있는 소모임 이용팁",
  },
  {
    id: 3,
    image: "/images/Banner3.png",
    alt: "소모임 참여 전, 안전한 이용 가이드를 꼭 확인하세요!",
  },
  {
    id: 4,
    image: "/images/Banner4.png",
    alt: "city pass로 더 가깝게!",
  },
  {
    id: 5,
    image: "/images/Banner5.png",
    alt: "소모임 전, 꼭 알아두어야 할 주의사항",
  },
];

export default function ImageSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 10초마다 자동으로 다음 슬라이드로 이동
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 10000); // 10초

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <h1 className="text-h1 text-grayScale-700 w-[1000px]">다양한 소모임을 둘러보고 참여해보세요!</h1>
      <button
        type="button"
    
        className="w-[1000px] h-[90px] relative rounded-2xl border-none outline-none cursor-pointer"
      >
        {/* 슬라이드 이미지들: 겹쳐두고 opacity로 페이드 전환 */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              absolute inset-0
              transition-opacity duration-700 ease-out
              ${index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              style={{ objectFit: 'cover', borderRadius: '8px' }}
              priority={index === 0}
            />
          </div>
        ))}
      </button>
    </div>
  );
}