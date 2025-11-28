"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    imageMobile: "/images/mobile/mainBanner.png",
    imagePc: "/images/mainBanner.png",
    alt: "helpie 메인 배너",
  },
  {
    id: 2,
    imageMobile: "/images/mobile/Banner1.png",
    imagePc: "/images/Banner2.png",
    alt: "믿고 참여할 수 있는 소모임 이용팁",
  },
  {
    id: 3,
    imageMobile: "/images/mobile/Banner2.png",
    imagePc: "/images/Banner3.png",
    alt: "소모임 참여 전, 안전한 이용 가이드를 꼭 확인하세요!",
  },
  {
    id: 4,
    imageMobile: "/images/mobile/Banner3.png",
    imagePc: "/images/Banner4.png",
    alt: "city pass로 더 가깝게!",
  },
  {
    id: 5,
    imageMobile: "/images/mobile/Banner4.png",
    imagePc: "/images/Banner5.png",
    alt: "소모임 전, 꼭 알아두어야 할 주의사항",
  },
];

export default function ImageSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[375px] md:max-w-[1000px] flex flex-col items-start gap-3">
        <h1 className="text-body1-sb md:text-h1 text-grayScale-700">
          다양한 소모임을 둘러보고 참여해보세요!
        </h1>

        <button
  type="button"
  className="
    relative w-full
    h-[120px] md:h-[90px]
    rounded-2xl overflow-hidden
    border-none outline-none cursor-pointer
  "
>
  {slides.map((slide, index) => (
    <div
      key={slide.id}
      className={`
        absolute inset-0
        transition-opacity duration-700 ease-out
        rounded-2xl overflow-hidden
        ${
          index === currentIndex
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      {/* PC */}
      <Image
        src={slide.imagePc}
        alt={slide.alt}
        fill
        className="hidden md:block object-cover rounded-2xl"
        priority={index === 0}
      />
      {/* Mobile */}
      <Image
        src={slide.imageMobile}
        alt={slide.alt}
        fill
        className="block md:hidden object-contain"
        priority={index === 0}
      />
    </div>
  ))}
</button>

      </div>
    </div>
  );
}
