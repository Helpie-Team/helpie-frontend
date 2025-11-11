"use client";

import React, { useState } from "react";
import Image from "next/image";
import heart from "@/public/icons/heart.png";
import noHeart from "@/public/icons/noHeart.png";
import noImage from "@/public/images/noImage.png";
import fire from "@/public/icons/fire.png";
import JoinModal from "./modal/JoinModal";

// 더미 데이터
const meetingData = [
  { dday: 3, category: "서양 / 요리", categoryColor: "bg-[#7BAF6E]", location: "서울", participants: "15명", title: "창경궁 여행 같이 가요~!", description: "고궁의 멋과 추억을, 편한 한복으로 안전히 시간 ~" },
  { dday: 5, category: "예술 / 취미", categoryColor: "bg-[#F5A623]", location: "서울", participants: "6명", title: "한복입고 같이 경복궁 가요~!", description: "친밀한 장을 만고, 한국의 이념과 문화를 함께 누려봅시다!" },
  { dday: 10, category: "사회 / 교류", categoryColor: "bg-[#7BAF6E]", location: "서울", participants: "10명", title: "한국에서 같이 전철 역여러 고궁다녀 요즘과 경관 짭게 감싸~!", description: "고궁다녀 요즘에 않의이 먹이하고 짭게 감싸 쟈외~" },
  { dday: 14, category: "역사/문화", categoryColor: "bg-[#9B6FCC]", location: "서울", participants: "7명", title: "Korean Pottery Class;)", description: "한국의 아릉다운 노릇을 보는 나만의 그릇을 만들어 가십니" },
  { dday: 3, category: "게임 / 오락", categoryColor: "bg-[#4A90E2]", location: "서울", participants: "8명", title: "MARVEL DAY 🦸", description: "마블은 각 히어로에서 대를 열영 안 받으~" },
  { dday: 20, category: "사회 / 교류", categoryColor: "bg-[#7BAF6E]", location: "서울", participants: "15명", title: "한밤의 오페라 공연관람 ~", description: "국립 오페라단 공연 함께 관람하고 이야기 꽃을피워봐!" },
  { dday: 6, category: "자기계발 / 성장", categoryColor: "bg-[#E94B3C]", location: "서울", participants: "8명", title: "GRWM 서울 같이 준비해요!", description: "북성향 해줘서달, 같이 의로 헤헴 값여 저의 관찰 얻어갑니다 :)" },
  { dday: 15, category: "사회 / 교류", categoryColor: "bg-[#7BAF6E]", location: "서울", participants: "20명", title: "FIFA 월드컵 다함께보기 ⚽", description: "각자 응원하는 팀이 맞는 게임을 기억!" },
  { dday: 3, category: "서양 / 요리", categoryColor: "bg-[#7BAF6E]", location: "서울", participants: "15명", title: "소모임 제목을 입력하세요", description: "멤버될 소모임 설명을 두 줄까지 표시됩니다." },
];

export default function MatchingCards() {
  const [liked, setLiked] = useState<boolean[]>(Array(meetingData.length).fill(false));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row flex-wrap gap-4">
        {meetingData.map((meeting, index) => (
          <div
            key={index}
            className="w-[180px] rounded-2xl flex flex-col cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="relative w-full h-[130px]">
              <Image
                src={noImage}
                alt="이미지 없음"
                width={180}
                height={180}
                className="object-cover rounded-2xl"
              />
              {/* D-day 배지 */}
              <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-caption1 font-semibold">
                D-{meeting.dday}
              </div>
              {/* 불 아이콘 */}
              <Image
                src={fire}
                alt="불"
                width={24}
                height={24}
                className="absolute top-2 right-2"
              />
             
              {/* 하트 버튼 */}
              <button
                type="button"
                aria-pressed={liked[index]}
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(prev => {
                    const next = [...prev];
                    next[index] = !next[index];
                    return next;
                  });
                }}
                className="absolute bottom-1 right-2 w-[32px] h-[32px] z-10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src={liked[index] ? heart : noHeart}
                  alt="찜하기"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            {/* 텍스트 영역 */}
            <div className="flex flex-col gap-1 px-2 mt-2">
              <div className="flex items-center gap-2 text-caption1-regular text-grayScale-500">
                 {/* 카테고리 배지 */}
              <div className={` ${meeting.categoryColor} text-white px-2 py-0.75 rounded-full text-caption1-b`}>
                {meeting.category}
              </div>
                <span>{meeting.location}</span>
                <span>{meeting.participants}</span>
              </div>
              <h3 className="text-body2 text-black line-clamp-1">{meeting.title}</h3>
              <p className="text-body3-regular text-grayScale-600 line-clamp-2">
                {meeting.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <JoinModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
