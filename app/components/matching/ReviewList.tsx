"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import chatIcon from "@/public/icons/chatIcon.png";
import noImage from "@/public/images/noImage.png";
import { usePublicReviewList } from "@/app/hooks/review/useReview";
import { ReviewItem } from "@/app/api/types/review/review";
import cancelIcon from "@/public/icons/cancelIcon.png";
import leftArrow from "@/public/icons/leftArrow.png";
import rightArrow from "@/public/icons/rightArrow.png";

export default function ReviewList() {
  const [page, setPage] = useState(0);
  const { data: reviewListData, isLoading, error } = usePublicReviewList({
    page,
  });
  const [sortOption, setSortOption] = useState<"latest" | "rating">("latest");
  const [expandedReviews, setExpandedReviews] = useState<
    Record<number, boolean>
  >({});
  const [allReviews, setAllReviews] = useState<ReviewItem[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isImageModalOpen) {
        handleCloseImageModal();
      }
    };

    if (isImageModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // 배경 스크롤 방지
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isImageModalOpen]);

  // 페이지 데이터가 로드되면 누적 (중복 제거)
  useEffect(() => {
    if (reviewListData?.content) {
      if (page === 0) {
        setAllReviews(reviewListData.content);
      } else {
        setAllReviews((prev) => {
          const existingIds = new Set(prev.map((r) => r.reviewId));
          const newReviews = reviewListData.content.filter(
            (r) => !existingIds.has(r.reviewId),
          );
          return [...prev, ...newReviews];
        });
      }
    }
  }, [reviewListData, page]);

  // 정렬 옵션 변경
  const handleSortChange = (option: "latest" | "rating") => {
    setSortOption(option);
  };

  // 정렬된 데이터
  const reviewData = [...allReviews].sort((a, b) => {
    switch (sortOption) {
      case "latest":
        return (
          new Date(b.meetingDate).getTime() -
          new Date(a.meetingDate).getTime()
        );
      case "rating":
        return b.rate - a.rate;
      default:
        return 0;
    }
  });

  const handleLoadMore = () => {
    if (reviewListData && !reviewListData.last) {
      setPage((prev) => prev + 1);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}.${String(date.getDate()).padStart(2, "0")} 참여`;
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? "text-key-200" : "text-grayScale-200"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );

  // 이미지 모달 열기
  const handleOpenImageModal = (images: (string | null)[], index: number) => {
    const validImages = images.filter(
      (img): img is string => !!img && img.trim() !== "",
    );
    if (validImages.length === 0) return;

    setActiveImages(validImages);
    setActiveIndex(index);
    setIsImageModalOpen(true);
  };

  // 모달 닫기
  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setActiveImages([]);
    setActiveIndex(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 터치/스와이프 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // 오른쪽으로 스와이프 (다음 이미지)
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      // 왼쪽으로 스와이프 (이전 이미지)
      handlePrevImage();
    }
  };

  // 마우스 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // 오른쪽으로 드래그 (다음 이미지)
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      // 왼쪽으로 드래그 (이전 이미지)
      handlePrevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // 이전 / 다음
  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) =>
      prev === activeImages.length - 1 ? 0 : prev + 1,
    );
  };

  // 로딩 상태 (첫 페이지)
  if (isLoading && page === 0 && allReviews.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <p className="text-body1-regular text-grayScale-500">
          후기를 불러오는 중...
        </p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <p className="text-body1-regular text-grayScale-500">
          후기를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  // 데이터 없음
  if (!reviewData || reviewData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <p className="text-body1-regular text-grayScale-500">
          아직 작성된 후기가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* PC / 태블릿 헤더 */}
      <div className="hidden sm:flex items-start gap-4">
        <Image
          src={chatIcon}
          alt="채팅 아이콘"
          width={40}
          height={38}
          className="flex"
        />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-h1 text-black">소모임 참여 후기</h2>
          <div className="flex flex-row justify-between items-center">
            <p className="text-body1 text-grayScale-700">
              HELPie 회원들이 직접 남긴 생생한 소모임 후기를 만나보세요.
            </p>

            {/* 정렬 버튼 (PC) */}
            <div className="flex gap-4 text-body1">
              <button
                onClick={() => handleSortChange("latest")}
                className={
                  sortOption === "latest"
                    ? "text-black"
                    : "text-grayScale-500"
                }
              >
                최신순
              </button>
              <button
                onClick={() => handleSortChange("rating")}
                className={
                  sortOption === "rating"
                    ? "text-black"
                    : "text-grayScale-500"
                }
              >
                좋아요순
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 헤더 : 정렬 버튼만 노출 */}
      <div className="flex sm:hidden justify-start gap-3 text-body1 px-1">
        <button
          onClick={() => handleSortChange("latest")}
          className={
            sortOption === "latest" ? "text-black" : "text-grayScale-500"
          }
        >
          최신순
        </button>
        <span className="w-px h-4 bg-grayScale-200" />
        <button
          onClick={() => handleSortChange("rating")}
          className={
            sortOption === "rating" ? "text-black" : "text-grayScale-500"
          }
        >
          좋아요순
        </button>
      </div>

      {/* 구분선 (PC 전용) */}
      <hr className="hidden sm:block border-grayScale-100" />

      {/* 리뷰 리스트 */}
      <div className="flex flex-col gap-6">
        {reviewData.map((review) => (
          <div
            key={review.reviewId}
            className="border-b border-grayScale-100 pb-6"
          >
            <div className="flex gap-4">
              {/* 프로필 아이콘 */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-grayScale-100 flex items-center justify-center flex-shrink-0">
                {review.profileImage ? (
                  <Image
                    src={review.profileImage}
                    alt={review.reviewerName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-h3 text-grayScale-500">👤</span>
                )}
              </div>

              {/* 리뷰 내용 */}
              <div className="flex-1 flex flex-col gap-3">
                {/* 닉네임 */}
                <h3 className="text-body1-medium text-black">
                  {review.reviewerName}
                </h3>

                {/* 소모임 제목 & 날짜 & 별점 */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                  {/* 제목 + 날짜 묶음 */}
                  <div className="flex items-center gap-2">
                    <span className="text-body3-regular text-grayScale-600 line-clamp-1 sm:line-clamp-none">
                      {review.groupTitle}
                    </span>
                    <span className="text-caption1-regular text-grayScale-500">
                      {formatDate(review.meetingDate)}
                    </span>
                  </div>

                  {/* 별점 */}
                  <div className="mt-1 sm:mt-0 sm:ml-3">
                    {renderStars(review.rate)}
                  </div>
                </div>

                {/* 리뷰 텍스트 */}
                <p className="text-body2-regular text-black">
                  {expandedReviews[review.reviewId]
                    ? review.description
                    : `${review.description.slice(0, 100)}${
                        review.description.length > 100 ? "..." : ""
                      }`}
                </p>

                {/* 더보기 버튼 */}
                {review.description.length > 100 && (
                  <button
                    onClick={() => {
                      setExpandedReviews((prev) => ({
                        ...prev,
                        [review.reviewId]: !prev[review.reviewId],
                      }));
                    }}
                    className="text-body3-regular text-grayScale-500 text-left flex items-center gap-1"
                  >
                    {expandedReviews[review.reviewId] ? "접기" : "더보기"}{" "}
                    <span>›</span>
                  </button>
                )}

                {/* 이미지 썸네일 */}
                {review.reviewImages && review.reviewImages.length > 0 && (
                  <div className="flex gap-2">
                    {review.reviewImages.map((image, imgIndex) => (
                      <button
                        key={imgIndex}
                        type="button"
                        onClick={() =>
                          handleOpenImageModal(review.reviewImages!, imgIndex)
                        }
                        className="w-24 h-24 bg-grayScale-200 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image || noImage}
                          alt={`리뷰 이미지 ${imgIndex + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {reviewListData && !reviewListData.last && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full py-4 border border-grayScale-300 rounded-full text-body1 text-grayScale-700 hover:bg-grayScale-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "로딩 중..." : "참여 후기 더보기"}
        </button>
      )}

      {/* 이미지 확대 모달 */}
      {isImageModalOpen && activeImages.length > 0 && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70"
          onClick={handleCloseImageModal}
        >
          <div
            className="relative w-full max-w-[960px] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={handleCloseImageModal}
              className="absolute right-6 top-6 text-white p-2"
            >
              <Image src={cancelIcon} width={26} height={26} alt="취소아이콘" />
            </button>

            <div className="flex flex-col items-center gap-10">
              {/* 메인 이미지 + 화살표 + 인덱스 (이미지 밖 배치) */}
              <div className="relative flex items-center justify-center">
                {/* 큰 이미지 박스 */}
                <div
                  className="relative w-[90vw] max-w-[720px] aspect-square sm:aspect-[4/3] rounded-[32px] overflow-hidden bg-black/40 cursor-pointer select-none"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <Image
                    src={activeImages[activeIndex] ?? noImage}
                    alt={`리뷰 이미지 ${activeIndex + 1}`}
                    fill
                    className="object-cover"
                    draggable={false}
                  />
                </div>

                {/* 왼쪽 화살표 */}
                {activeImages.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute -left-15 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full  text-white"
                  >
                    <Image src={leftArrow} width={26} height={26} alt="왼쪽 화살표" />
                  </button>
                )}

                {/* 오른쪽 화살표 */}
                {activeImages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute -right-15 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full  text-white"
                  >
                    <Image src={rightArrow} width={26} height={26} alt="오른쪽 화살표"  />
                  </button>
                )}

                {/* 가운데 하단 인덱스 배지 (이미지 밖) */}
                {activeImages.length > 1 && (
                  <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                    {activeIndex + 1} / {activeImages.length}
                  </div>
                )}
              </div>

              {/* 썸네일 리스트 */}
              {activeImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto
      w-[90vw] max-w-[720px]   /* ✅ 위 이미지랑 같은 폭 */
      mt-4 mx-auto   ">
                  {activeImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border ${
                        idx === activeIndex
                          ? "border-key-100 "
                          : "border-transparent opacity-70"
                      }`}
                    >
                      <Image
                        src={img || noImage}
                        alt={`썸네일 ${idx + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
