//3.2.1.0 소모임참여하기
"use client";
import React, { useState } from "react";
import arrow_left from '@/public/icons/arrow_left.png';
import Image from "next/image";
import { Share2, MapPin, Users, Tag, Eye, Clock } from "lucide-react";
import noImage from "@/public/images/noImage.png";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function JoinModal({ isOpen, onClose, onConfirm }: JoinModalProps) {
  const [isJoined, setIsJoined] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    setIsJoined(true); 
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    setIsJoined(false);
    // 실제 취소 로직 추가 예정
  };

  // 예시 데이터
  const meetingData = {
    title: "종량구 국밥투어 같이해요~",
    location: "서울",
    participants: { current: 2, max: 5 },
    category: "액티비티·라이프",
    views: 7,
    dateTime: "2025년 12월 17일 오후 1시",
    description: "종량구에서 뜨끈한 국밥 투어 같이 하실 분 모십니다!\n국밥 맛집 탐방하며 뜨듯하게 배 채우고, 함께 이야기 꽃을 피워봐요. 혼밥은 이제 그만!"
  };

  return (
    <div
      id="모달 외부"
      onClick={handleBackdropClick}
      className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50"
    >
      <div
        id="모달 내부"
        className="w-[736px] bg-white rounded-[30px] p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
              <Image
                src={arrow_left}
                alt="뒤로 가기"
                width={24}
                height={24}
              />
            </button>
            <h2 className="text-h2">모임요약</h2>
          </div>
          <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* 이미지  */}
        <div className="flex gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex-1 h-80 bg-gray-200 rounded-2xl overflow-hidden">
              <Image
                src={noImage}
                alt={`모임 이미지 ${index}`}
                width={330}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* 모임 정보 */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-3 items-center">
          <h1 className="text-h1 ">{meetingData.title}</h1>

          {/* 아이콘 정보 */}
          <div className="flex items-center gap-3 text-body3 text-grayScale-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{meetingData.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>
                {meetingData.participants.current}/<span className="text-grayScale-400">{meetingData.participants.max}</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{meetingData.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{meetingData.views}</span>
            </div>
          </div>
          </div>

          {/* 날짜/시간 */}
          <div className="flex items-center gap-3 text-h3-regular text-grayScale-600">
            <Clock className="w-5 h-5" />
            <span>{meetingData.dateTime}</span>
          </div>

          {/* 설명 */}
          <p className="text-h3-regular text-grayScale-600 whitespace-pre-line">
            {meetingData.description}
          </p>
        </div>

        {/* 버튼 영역 - 가입 여부에 따라 다른 버튼 표시 */}
        {isJoined ? (
          /* 가입한 모임 - 신청취소 + 채팅방으로 이동 */
          <div className="w-full flex flex-row gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-4 bg-grayScale-100 text-grayScale-700 text-h3-sb rounded-full hover:bg-grayScale-200 transition-colors"
            >
              신청취소
            </button>
            <button
              className="flex-1 py-4 bg-grayScale-700 text-white rounded-full text-h3-sb hover:bg-grayScale-800 transition-colors"
            >
              채팅방으로 이동
            </button>
          </div>
        ) : (
          /* 가입하지 않은 모임 - 참여하기 */
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-grayScale-700 text-white rounded-full text-h3-sb hover:bg-grayScale-800 transition-colors"
          >
            참여하기
          </button>
        )}
      </div>
    </div>
  );
}