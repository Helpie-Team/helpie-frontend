"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { isAuthenticated } from "@/app/lib/utils/token";
import {
  useCommunities,
  useSearchCommunities,
  useToggleCommunityLikeMutation,
} from "@/app/hooks/community/useCommunity";
import type {
  CommunityCategory,
  CommunityPost,
} from "@/app/api/types/community/community";
import { PopularBar } from "../../components/community/PopularBar";
import { CommunityCreateModal } from "@/app/components/community/CommunityCreateModal";
import { PostImageCarousel } from "@/app/components/community/PostImageCarousel";
import { LoadingSpinner } from "@/app/components/common/LoadingSpinner";
import { ThumbsUp, MessageCircle } from "lucide-react";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { mutate: toggleLike } = useToggleCommunityLikeMutation();
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [postList, setPostList] = useState<CommunityPost[]>([]);
  // 무한스크롤용 페이지 번호 + 옵저버 ref
  const [page, setPage] = useState(0);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const category = [{ name: "전체" }, { name: "정보공유" }, { name: "자유게시판" }];

  const getApiCategory = (categoryName: string): CommunityCategory => {
    switch (categoryName) {
      case "정보공유":
        return "INFO_SHARE";
      case "자유게시판":
        return "FREE_BOARD";
      case "전체":
      default:
        return "ALL";
    }
  };

  const apiCategory = getApiCategory(selectedCategory);

  // 기본 커뮤니티 리스트 (무한스크롤용)
  const requestParams = {
    category: apiCategory,
    page,
    size: 10,
  };

  const { posts, loading, loadingMore, error, hasMore } =
    useCommunities(requestParams);

  // 클라이언트에서만 인증 상태 확인 (Hydration 에러 방지)
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  // 서버에서 가져온 posts 가 바뀔 때마다 로컬 상태 갱신
  useEffect(() => {
    setPostList(posts);
  }, [posts]);

  // 📡 검색 API (검색 키워드 + 카테고리)
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchCommunities(searchKeyword, apiCategory, 0, 10);

  // 지금 검색 중인지 여부 (검색 키워드가 있을 때)
  const isSearching = searchKeyword.trim().length > 0;

  // 실제로 렌더링할 게시글 리스트
  const postsToRender = isSearching ? searchData?.content ?? [] : postList;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleCategorySelect = (name: string) => {
    setSelectedCategory(name);
    setIsDropdownOpen(false);
    setPage(0); // 카테고리 바뀌면 페이지 리셋
  };

  const handleToggleLike = (postId: number) => {
    toggleLike(postId, {
      onSuccess: (isLiked) => {
        // API 응답: true → 좋아요한 상태, false → 취소된 상태
        setPostList((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked,
                  likesCount: post.likesCount + (isLiked ? 1 : -1),
                }
              : post
          )
        );

        console.log("좋아요 변경됨, 인기글 순위 업데이트 중...");
      },
      onError: () => {
        alert("좋아요 처리에 실패했어요. 다시 시도해 주세요.");
      },
    });
  };

  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim();
    setPage(0);

    // 입력이 비어있으면 검색 해제 → 전체 리스트 모드
    if (!trimmed) {
      setSearchKeyword("");
      return;
    }

    // 검색 모드로 전환
    setSearchKeyword(trimmed);
  };

  useEffect(() => {
    if (isSearching) return; // 검색 중에는 무한스크롤 비활성화

    const target = observerRef.current;
    if (!target) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, loadingMore, isSearching]);

  const showLoading =
    (isSearching && isSearchLoading && !searchData) ||
    (!isSearching && loading && posts.length === 0);

  const showError = isSearching ? isSearchError : error;

  return (
    <div className="flex flex-col items-center gap-8 px-4 md:px-8">
      {/* 상단 헤더 영역 */}
      <div className="flex flex-col items-center h-[136px] gap-6 border-b border-grayScale-200 w-full max-w-[1000px]">
        <div className="flex items-center justify-between w-full h-11">
          <div className="flex h-[43px] w-full md:w-[531px] items-center gap-4 text-[28px] md:text-[32px] font-semibold leading-none text-black">
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <p>{selectedCategory}</p>
                <Image
                  src="/icons/down.png"
                  alt="dropdown"
                  width={34}
                  height={34}
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* 드롭다운 */}
              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+16px)] left-0 z-50 w-[200px] overflow-hidden rounded-lg border border-grayScale-200 bg-white shadow-lg">
                  {category.map((categoryItem, index) => (
                    <div
                      key={categoryItem.name}
                      className={`cursor-pointer px-6 py-4 text-body1-regular ${
                        categoryItem.name === selectedCategory
                          ? "font-semibold text-grayScale-700"
                          : "text-grayScale-500"
                      } ${
                        index !== category.length - 1
                          ? "border-b border-grayScale-100"
                          : ""
                      } hover:bg-grayScale-50`}
                      onClick={() => handleCategorySelect(categoryItem.name)}
                    >
                      {categoryItem.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="hidden md:block">커뮤니티</p>
          </div>

          {/* 게시글 작성 버튼 */}
          {isLoggedIn && (
            <button
              className="flex h-[43px] w-[150px] md:w-[133px] items-center justify-center rounded-full bg-grayScale-700 px-3 py-4 text-xs md:text-base font-semibold text-grayScale-white"
              onClick={() => setIsModalOpen(true)}
            >
              게시글 작성하기
            </button>
          )}
        </div>

        {/* 🔎 검색창 */}
        <div className="relative w-full max-w-[1000px]">
          <input
            type="text"
            className="h-[44px] w-full rounded-full border border-grayScale-filter py-2 pl-3 pr-12 text-body2-regular placeholder:text-grayScale-300"
            placeholder="게시글 제목 또는 내용을 검색해보세요"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
          />
          <Image
            src="/icons/searchIcon.png"
            alt="search"
            width={24}
            height={24}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={handleSearchSubmit}
          />
        </div>

      </div>

      {/* 메인 영역 */}
      <div className="flex w-full max-w-[1000px] flex-col md:flex-row gap-6 md:gap-8">
        {/* 게시글 리스트 */}
        <div className="flex-1">
          {/* 선택된 카테고리 타이틀 */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-h2 md:text-h1 text-black">
              {selectedCategory}
              {isSearching && searchKeyword && (
                <span className="ml-2 text-body2-regular text-grayScale-500">
                  ‘{searchKeyword}’ 검색 결과
                </span>
              )}
            </span>
          </div>

          {/* 상태 처리 */}
          {showLoading && (
            <LoadingSpinner
              size="large"
              showText={true}
              text="게시글을 불러오는 중..."
            />
          )}

          {showError && (
            <div className="py-8 text-center text-red-500">
              오류가 발생했습니다. 다시 시도해주세요.
            </div>
          )}

          {!showLoading && !showError && postsToRender.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              {isSearching
                ? "검색 결과가 없습니다."
                : "아직 작성된 게시글이 없습니다."}
            </div>
          )}

          {/* 게시글 카드들 */}
          <div className="space-y-6">
            {postsToRender.map((post) => (
              <div key={post.id} className="bg-white py-4 px-4 md:px-6">
                <div className="flex flex-col md:block">
                  {/* 프로필 + 메타 */}
                  <div className="flex w-full items-start gap-3 mb-3 order-1 md:order-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                      <span className="text-xs font-medium text-gray-600">
                        {post.username?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-body3-regular text-black">
                        {post.username}
                      </p>
                      <div className="flex flex-wrap items-center gap-1 text-caption1-regular text-grayScale-500">
                        <span>{post.categoryDisplayName}</span>
                        <span className="mx-1">·</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 이미지 캐러셀 - 모바일에서 먼저 */}
                  <div className="order-2 md:order-3">
                    <PostImageCarousel
                      imageUrls={post.imageUrls}
                      title={post.title}
                    />
                  </div>

                  {/* 제목 - 모바일에서 이미지 다음 */}
                  <div className="order-3 md:order-2 pb-3">
                    <h3 className="text-h3 text-body1-sb md:text-h2 text-black">
                      {post.title}
                    </h3>
                  </div>

                  {/* 내용 - 모바일에서 제목 다음 */}
                  <p className="text-body2 md:text-body1 text-gray-700 order-4 md:order-5 mb-3">
                    {post.content}
                  </p>

                  {/* 좋아요 / 댓글 - 모바일에서 마지막 */}
                  <div className="flex items-center gap-4 order-5 md:order-4">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className="flex items-center gap-2"
                      disabled={!isLoggedIn}
                    >
                      <ThumbsUp
                        className={`w-6 h-6 transition-colors ${
                          post.isLiked ? "text-key-100" : "text-grayScale-700"
                        }`}
                      />
                      <span className="text-grayScale-700">
                        {post.likesCount}
                      </span>
                    </button>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 text-grayScale-700" />
                      <span className="text-grayScale-700">
                        {post.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 무한스크롤 sentinel - 검색 중이 아닐 때만 */}
            {!isSearching && hasMore && (
              <div ref={observerRef} className="py-4 text-center">
                {loadingMore ? (
                  <LoadingSpinner
                    size="medium"
                    showText={true}
                    text="더 많은 게시글을 불러오는 중..."
                    className="py-2"
                  />
                ) : (
                  <div className="h-1" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* 우측 인기글 바 */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <PopularBar />
        </div>
      </div>

      {/* 게시글 작성 모달 */}
      <CommunityCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // 성공 시 새로고침 (간단 처리)
          window.location.reload();
        }}
      />
    </div>
  );
}
