"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import heart from "@/public/icons/heart.png";
import noHeart from "@/public/icons/noHeart.png";
import noImage from "@/public/images/noImage.png";
import fire from "@/public/icons/fire.png";
import JoinModal from "./modal/JoinModal";
import LoginModal from "./modal/LoginModal";
import { useGroupListByAuth, useToggleGroupMark, useSearchPublicGroups } from "@/app/hooks/matching/useMatching";
import { GroupCategory, GroupListItem } from "@/app/api/types/matching/matching";
import { useMyBookmarkInfo, MY_BOOKMARK_INFO_QUERY_KEY } from "@/app/hooks/my-page/useMyBookmarkInfo";
import { MyBookmarkItem } from "@/app/api/types/my-page/group";

interface MatchingCardsProps {
  country: string;
  category: GroupCategory;
  searchKeyword?: string;
}

// 카테고리별 색상 매핑
const categoryColors: Record<GroupCategory, string> = {
  'ALL': 'bg-grayScale-500',
  'HOBBY': 'bg-[#7BAF6E]',
  'ART': 'bg-[#F5A623]',
  'LIFE': 'bg-[#9B6FCC]',
  'STUDY': 'bg-[#E94B3C]',
  'SOCIAL': 'bg-[#4A90E2]',
};

// 카테고리 한글 표시
const categoryDisplayNames: Record<GroupCategory, string> = {
  'ALL': '전체',
  'HOBBY': '문화·취미',
  'ART': '예술·창작',
  'LIFE': '액티비티·라이프',
  'STUDY': '자기계발·성장',
  'SOCIAL': '사회·교류',
};

export default function MatchingCards({ country, category, searchKeyword }: MatchingCardsProps) {
  const [page, setPage] = useState(0);
  const [allMeetings, setAllMeetings] = useState<GroupListItem[]>([]);
  const [likedGroups, setLikedGroups] = useState<Set<number>>(new Set());
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const queryClient = useQueryClient();
  const toggleMarkMutation = useToggleGroupMark();

  // 검색 모드 vs 일반 모드
  const { data: searchData, isLoading: isSearchLoading, error: searchError } = useSearchPublicGroups(
    country,
    searchKeyword || '',
    page
  );
  const { data: groupListData, isLoading, error } = useGroupListByAuth({ country, category, page });

  // 검색 모드일 때 검색 결과 사용, 아니면 일반 목록 사용
  const currentData = searchKeyword ? searchData : groupListData;
  const currentLoading = searchKeyword ? isSearchLoading : isLoading;
  const currentError = searchKeyword ? searchError : error;

  // 로그인한 유저의 관심 목록 가져오기 (하트 초기 상태용)
  const bookmarkQuery = useMyBookmarkInfo({
    size: 100,
    enabled: isLoggedIn,
  });

  // 클라이언트에서만 로그인 상태 확인
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  // 북마크 목록이 바뀔 때마다 likedGroups 초기화
  useEffect(() => {
    if (!bookmarkQuery.data) return;

    const allBookmarks: MyBookmarkItem[] = bookmarkQuery.data.pages.flatMap(
      (page) => page.content ?? []
    );

    const idSet = new Set<number>();
    allBookmarks.forEach((item) => {
      if (typeof item.id === 'number') {
        idSet.add(item.id);
      }
    });

    setLikedGroups(idSet);
  }, [bookmarkQuery.data]);

  // country, category, searchKeyword가 변경되면 page를 0으로 리셋하고 데이터 초기화
  useEffect(() => {
    setPage(0);
    setAllMeetings([]);
  }, [country, category, searchKeyword]);

  // 새로운 페이지 데이터가 로드되면 누적
  useEffect(() => {
    if (currentData?.content) {
      if (page === 0) {
        setAllMeetings(currentData.content);
      } else {
        setAllMeetings(prev => [...prev, ...currentData.content]);
      }
    }
  }, [currentData, page]);

  const handleCardClick = (groupId: number) => {
    // 로그인 상태에 따라 다른 모달 띄우기
    if (isLoggedIn) {
      setSelectedGroupId(groupId);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleCloseJoinModal = () => {
    setSelectedGroupId(null);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLikeClick = (groupId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    // 이전 상태 백업 (롤백용)
    const prevLiked = new Set(likedGroups);

    // 낙관적 토글
    setLikedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });

    // 서버 요청
    toggleMarkMutation.mutate(groupId, {
      onSuccess: () => {
        // 마이페이지 관심 탭 최신화
        queryClient.invalidateQueries({
          queryKey: MY_BOOKMARK_INFO_QUERY_KEY,
        });
      },
      onError: (err) => {
        console.error('관심 소모임 토글 중 오류:', err);
        // 실패 시 롤백
        setLikedGroups(prevLiked);
      },
    });
  };

  const handleLoadMore = () => {
    if (currentData && !currentData.last) {
      setPage(prev => prev + 1);
    }
  };

  // D-day 계산 함수
  const calculateDday = (meetingDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meeting = new Date(meetingDate);
    meeting.setHours(0, 0, 0, 0);
    const diffTime = meeting.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 로딩 상태 (첫 로딩만)
  if (currentLoading && page === 0 && allMeetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-body1-regular text-grayScale-500">
          {searchKeyword ? '검색 중...' : '소모임을 불러오는 중...'}
        </p>
      </div>
    );
  }

  // 에러 상태 - 하지만 이미 로드된 데이터가 있으면 그것을 보여줌
  if (currentError && allMeetings.length === 0 && page === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-body1-regular text-grayScale-500">
          {searchKeyword ? '검색 중 오류가 발생했습니다.' : '소모임을 불러오는 중 오류가 발생했습니다.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-key-100 text-white rounded-full hover:bg-key-200 transition-colors"
        >
          페이지 새로고침
        </button>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!allMeetings || allMeetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-body1-regular text-grayScale-500">
          {searchKeyword ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.` : '해당 조건에 맞는 소모임이 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {allMeetings.map((meeting) => {
          const dday = calculateDday(meeting.meetingDate);
          const categoryColor = categoryColors[meeting.category];
          const categoryDisplay = categoryDisplayNames[meeting.category];

          return (
            <div
              key={meeting.id}
              className="w-full rounded-2xl flex flex-col cursor-pointer"
              onClick={() => handleCardClick(meeting.id)}
            >
              <div className="relative w-full h-[120px] md:h-[130px] overflow-hidden rounded-2xl">
                <Image
                  src={meeting.thumbnail && typeof meeting.thumbnail === 'string' && meeting.thumbnail.trim() !== '' ? meeting.thumbnail : noImage}
                  alt={meeting.title}
                  fill

                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = noImage.src;
                  }}
                />
                {/* D-day 배지 */}
                <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-caption1 font-semibold">
                  D-{dday}
                </div>
                {/* 불 아이콘 (인기 소모임) */}
                {meeting.isPopular && (
                  <Image
                    src={fire}
                    alt="인기"
                    width={24}
                    height={24}
                    className="absolute top-2 right-2"
                  />
                )}

                {/* 하트 버튼 (로그인 상태에서만 표시) */}
                {isLoggedIn && (
                  <button
                    title="찜하기"
                    type="button"
                    aria-pressed={likedGroups.has(meeting.id)}
                    onClick={(e) => handleLikeClick(meeting.id, e)}
                    className="absolute bottom-1 right-2 w-[32px] h-[32px] z-10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                  >
                    <Image
                      src={likedGroups.has(meeting.id) ? heart : noHeart}
                      alt="찜하기"
                      width={24}
                      height={24}
                    />
                  </button>
                )}
              </div>

              {/* 텍스트 영역 */}
              <div className="flex flex-col gap-1 mt-2 px-1">
                <div className="flex items-center gap-1 text-mcaption1 sm:text-caption1-regular text-grayScale-500">
                  {/* 카테고리 배지 */}
                  <div className={`${categoryColor} text-white px-2 py-0.5 sm:px-2 sm:py-[3px] rounded-full text-mcaption1-sb sm:text-caption1-b whitespace-nowrap flex-shrink-0`}>
                    {categoryDisplay}
                  </div>
                  <span className="whitespace-nowrap">{meeting.cityName}</span>
                  <span className="whitespace-nowrap">{meeting.maxMember}명</span>
                </div>
                <h3 className="text-body3 sm:text-body2 text-black line-clamp-1 break-words">{meeting.title}</h3>
                <p className="text-mcaption1 sm:text-body3-regular text-grayScale-600 line-clamp-2 break-words">
                  {meeting.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 더보기 버튼 */}
      {currentData && !currentData.last && (
        <button
          onClick={handleLoadMore}
          disabled={currentLoading}
          className="w-full py-4 border border-grayScale-300 rounded-full text-body1 text-grayScale-700 hover:bg-grayScale-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentLoading ? '로딩 중...' : '소모임 더보기'}
        </button>
      )}

      {/* 로그인 상태일 때: JoinModal */}
      {selectedGroupId && (
        <JoinModal
          isOpen={true}
          onClose={handleCloseJoinModal}
          groupId={selectedGroupId}
        />
      )}

      {/* 비로그인 상태일 때: LoginModal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
    </div>
  );
}