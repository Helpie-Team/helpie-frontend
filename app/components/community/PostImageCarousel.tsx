"use client";

import React, { useState} from "react";
import Image from "next/image";

export function PostImageCarousel({
  imageUrls,
  title,
}: {
  imageUrls: string[];
  title: string;
}) {

  const [groupIndex, setGroupIndex] = useState(0);
  if (!imageUrls || imageUrls.length === 0) return null;


  if (imageUrls.length === 1) {
    return (
      <div className="mb-4 w-full">
        <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100">
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

  const totalGroups = Math.ceil(imageUrls.length / 2);
  const startIndex = groupIndex * 2;
  const groupImages = imageUrls.slice(startIndex, startIndex + 2);

  const showPrev = () =>
    setGroupIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  const showNext = () => setGroupIndex((prev) => (prev + 1) % totalGroups);

  const isSingleInGroup =
    groupImages.length === 1 || !groupImages[1]; // 마지막 그룹에서 1장만 남은 경우


  return (
    <div className="relative mb-4 w-full">
      <div className="flex h-100 w-full overflow-hidden rounded-lg bg-gray-100">
        {isSingleInGroup ? (
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
          //일반 그룹 → 2장씩 나란히
          <>
            <div className="relative h-full w-1/2 overflow-hidden">
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
  );
}
