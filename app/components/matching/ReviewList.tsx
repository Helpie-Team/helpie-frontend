"use client";

import React, { useState } from "react";
import Image from "next/image";
import chatIcon from "@/public/icons/chatIcon.png";
import heart from "@/public/icons/heart.png";
import noHeart from "@/public/icons/noHeart.png";
import noImage from "@/public/images/noImage.png";

const allReviewData = [
  {
    id: 1,
    nickname: "김헬피",
    meetingTitle: "한복입고 같이 경복궁 가요~!",
    date: "2025.10.24 참여",
    rating: 4,
    content: "여러 종류의 한복을 입어보고 친구들과 사진도 많이 남겼어요. 날씨도 좋고 분위기도 너무 좋아서 하루 종일 웃었어요 :) 함께한 사람들 덕분에 정말 즐겁고 따뜻한 시간이었어요",
    images: 3,
    likes: 13
  },
  {
    id: 2,
    nickname: "이헬피",
    meetingTitle: "Korean Pottery Class",
    date: "2025.9.27 참여",
    rating: 3,
    content: "처음으로 도자기를 직접 만들어봤는데 생각보다 재밌었어요! 흙의 촉감도 좋고, 집중하다 보니 시간 가는 줄 몰랐어요. 함께한 사람들과 웃으며 이야기 나누는 시간까지 정말 즐거웠습니다 🌿",
    images: 3,
    likes: 8
  },
  {
    id: 3,
    nickname: "박헬피",
    meetingTitle: "한옥에서 같이 전심 먹어요!",
    date: "2025.5.11 참여",
    rating: 4,
    content: "고즈넉한 한옥 분위기 속에서 맛있는 점심을 함께했어요. 정갈한 음식 덕분에 마음까지 편안해졌어요. 함께한 사람들과의 대화가 정말 즐겁고 따뜻한 시간이었어요",
    images: 3,
    likes: 12
  },
  {
    id: 4,
    nickname: "최헬피",
    meetingTitle: "GRWM 서류 같이 준비해요!",
    date: "2025.8.15 참여",
    rating: 5,
    content: "복잡한 행정 서류를 혼자 하려니 막막했는데, 함께 하니까 훨씬 수월했어요. 서로 도와가며 빠르게 처리할 수 있었습니다!",
    images: 3,
    likes: 15
  },
  {
    id: 5,
    nickname: "정헬피",
    meetingTitle: "FIFA 월드컵 다함께보기",
    date: "2025.7.20 참여",
    rating: 5,
    content: "응원하는 팀이 달라도 모두가 즐거웠어요. 열띤 경기를 함께 보며 환호하고 아쉬워하던 순간들이 기억에 남네요!",
    images: 3,
    likes: 20
  },
  {
    id: 6,
    nickname: "강헬피",
    meetingTitle: "한밤의 오페라 공연관람",
    date: "2025.6.10 참여",
    rating: 4,
    content: "오페라를 처음 봤는데 너무 감동적이었어요. 함께 간 분들과 공연 후 이야기 나누는 시간도 좋았습니다.",
    images: 3,
    likes: 11
  }
];

export default function ReviewList() {
  const [sortOption, setSortOption] = useState("latest");
  const [displayCount, setDisplayCount] = useState(3);
  const [liked, setLiked] = useState<boolean[]>(Array(allReviewData.length).fill(false));
  const [expandedReviews, setExpandedReviews] = useState<boolean[]>(Array(allReviewData.length).fill(false));

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 3, allReviewData.length));
  };

  const reviewData = allReviewData.slice(0, displayCount);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-lg ${star <= rating ? "text-key-200" : "text-grayScale-200"}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-start gap-4">
        <Image src={chatIcon} alt="채팅 아이콘" width={40} height={38} />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-h1 text-black">소모임 참여 후기</h2>
          <div className="flex flex-row justify-between items-center">
          <p className="text-body1 text-grayScale-700">
            HELPie 회원들이 직접 남긴 생생한 소모임 후기를 만나보세요.
          </p>
        <div className="flex gap-1 text-body1">
          <button
            onClick={() => setSortOption("latest")}
            className={sortOption === "latest" ? "text-black" : "text-grayScale-500"}
          >
            최신순
          </button>
          <button
            onClick={() => setSortOption("rating")}
            className={sortOption === "rating" ? "text-black" : "text-grayScale-500"}
          >
            별점순
          </button>
          <button
            onClick={() => setSortOption("likes")}
            className={sortOption === "likes" ? "text-black" : "text-grayScale-500"}
          >
            좋아요순
          </button>
          </div>
          </div>
        </div>
      </div>
<hr className="text-grayScale-100"/>
      {/* 리뷰 리스트 */}
      <div className="flex flex-col gap-6">
        {reviewData.map((review, index) => (
          <div key={review.id} className="border-b border-grayScale-100 pb-6">
            <div className="flex gap-4">
              {/* 프로필 아이콘 */}
              <div className="w-12 h-12 rounded-full bg-grayScale-100 flex items-center justify-center flex-shrink-0">
                <span className="text-h3 text-grayScale-500">👤</span>
              </div>

              {/* 리뷰 내용 */}
              <div className="flex-1 flex flex-col gap-3">
                {/* 닉네임 */}
                <h3 className="text-body1-medium text-black">{review.nickname}</h3>

                {/* 소모임 제목 & 날짜 & 별점 */}
                <div className="flex items-center gap-3">
                  <span className="text-body3-regular text-grayScale-600">{review.meetingTitle}</span>
                  <span className="text-caption1-regular text-grayScale-500">{review.date}</span>
                  {renderStars(review.rating)}
                </div>

                {/* 리뷰 텍스트 */}
                <p className="text-body2-regular text-black">
                  {expandedReviews[index] ? review.content : `${review.content.slice(0, 100)}...`}
                </p>

                {/* 더보기 버튼 */}
                {review.content.length > 100 && (
                  <button
                    onClick={() => {
                      const newExpanded = [...expandedReviews];
                      newExpanded[index] = !newExpanded[index];
                      setExpandedReviews(newExpanded);
                    }}
                    className="text-body3-regular text-grayScale-500 text-left flex items-center gap-1"
                  >
                    더보기 <span>›</span>
                  </button>
                )}

                {/* 이미지 */}
                <div className="flex gap-2">
                  {[...Array(review.images)].map((_, imgIndex) => (
                    <div key={imgIndex} className="w-24 h-24 bg-grayScale-200 rounded-lg overflow-hidden">
                      <Image
                        src={noImage}
                        alt={`리뷰 이미지 ${imgIndex + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* 좋아요 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newLiked = [...liked];
                      newLiked[index] = !newLiked[index];
                      setLiked(newLiked);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Image
                      src={liked[index] ? heart : noHeart}
                      alt="좋아요"
                      width={20}
                      height={20}
                    />
                    <span className="text-body3-regular text-grayScale-600">{review.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {displayCount < allReviewData.length && (
        <button
          onClick={handleLoadMore}
          className="w-full py-4 border border-grayScale-300 rounded-full text-body1 text-grayScale-700 hover:bg-grayScale-50 transition-colors"
        >
          참여 후기 더보기
        </button>
      )}
    </div>
  );
}
