"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export function PostImageCarousel({
  imageUrls,
  title,
}: {
  imageUrls: string[];
  title: string;
}) {
  const [groupIndex, setGroupIndex] = useState(0); // 데스크탑용(2장씩)
  const [slideIndex, setSlideIndex] = useState(0); // 모바일용(1장씩)
  const [isMobile, setIsMobile] = useState(false);

  // ---- 브레이크포인트 감지 (모바일 여부) ----
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // tailwind sm 기준
    };

    handleResize(); // 최초 1번
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 여기서부터 조건 분기 시작 (Hook 다 호출된 이후)
  if (!imageUrls || imageUrls.length === 0) return null;

  // 공통: 이미지 1장일 때는 그냥 한 장만
  if (imageUrls.length === 1) {
    return (
      <div className="mb-4 w-full">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-[24px] bg-gray-100">
          <Image
            src={imageUrls[0]}
            alt={`${title} 이미지`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
    );
  }

  if (isMobile) {
    const totalSlides = imageUrls.length;

    const showPrevMobile = () =>
      setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    const showNextMobile = () =>
      setSlideIndex((prev) => (prev + 1) % totalSlides);

    return (
      <div className="relative mb-4 w-full">
        <div className="relative h-64 w-full overflow-hidden rounded-[24px] bg-gray-100">
          <Image
            src={imageUrls[slideIndex]}
            alt={`${title} 이미지 ${slideIndex + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
          />

          {/* 좌우 버튼 */}
          {totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={showPrevMobile}
                className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={showNextMobile}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
              >
                ›
              </button>
            </>
          )}

          {/* 하단 인디케이터 */}
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {imageUrls.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === slideIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ===========================
   *  데스크탑: 2장씩 반반 캐러셀
   * =========================== */
  const totalGroups = Math.ceil(imageUrls.length / 2);
  const startIndex = groupIndex * 2;
  const groupImages = imageUrls.slice(startIndex, startIndex + 2);

  const showPrev = () =>
    setGroupIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  const showNext = () => setGroupIndex((prev) => (prev + 1) % totalGroups);

  const isSingleInGroup = groupImages.length === 1 || !groupImages[1];

  return (
    <div className="relative mb-4 w-full">
      <div className="relative h-80 w-full overflow-hidden rounded-[24px] bg-gray-100">
        <div className="flex h-full w-full">
          {isSingleInGroup ? (
            // 그룹에 1장만 있을 때: 전체 폭
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={groupImages[0]}
                alt={`${title} 이미지`}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ) : (
            <>
              <div className="relative h-full w-1/2 overflow-hidden border-r border-white">
                <Image
                  src={groupImages[0]}
                  alt={`${title} 이미지1`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="relative h-full w-1/2 overflow-hidden">
                <Image
                  src={groupImages[1]}
                  alt={`${title} 이미지2`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </>
          )}
        </div>

        {/* 좌우 이동 버튼 */}
        {totalGroups > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
