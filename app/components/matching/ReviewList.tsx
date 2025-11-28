"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import chatIcon from "@/public/icons/chatIcon.png";
import noImage from "@/public/images/noImage.png";
import { usePublicReviewList } from "@/app/hooks/review/useReview";
import { ReviewItem } from "@/app/api/types/review/review";

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
      {/* ✅ PC / 태블릿 헤더 */}
      <div className="hidden md:flex items-start gap-4">
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
      <div className="flex md:hidden justify-start gap-3 text-body1 px-1">
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
      <hr className="hidden md:block border-grayScale-100" />

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
<div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
  {/* 제목 + 날짜 묶음 (모바일/PC 모두 한 줄) */}
  <div className="flex items-center gap-2">
    <span className="text-body3-regular text-grayScale-600 line-clamp-1 md:line-clamp-none">
      {review.groupTitle}
    </span>
    <span className="text-caption1-regular text-grayScale-500">
      {formatDate(review.meetingDate)}
    </span>
  </div>

  {/* ⭐ 별점 : 모바일에서는 아래 줄, PC에선 옆으로 */}
  <div className="mt-1 md:mt-0 md:ml-3">
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

                {/* 이미지 */}
                {review.reviewImages && review.reviewImages.length > 0 && (
                  <div className="flex gap-2">
                    {review.reviewImages.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="w-24 h-24 bg-grayScale-200 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image || noImage}
                          alt={`리뷰 이미지 ${imgIndex + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
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
    </div>
  );
}
