"use client"
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { isAuthenticated } from "@/app/lib/utils/token";
import { useCommunities } from "@/app/hooks/community/useCommunity";
import type { CommunityCategory } from "@/app/api/types/community/community";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = isAuthenticated();
  const [page, setPage] = useState(0);

  const category = [
    { name: "전체"},
    { name: "정보공유" },
    { name: "자유게시판"},
  ];

  // 카테고리를 API 형식으로 변환
  const getApiCategory = (categoryName: string): CommunityCategory | undefined => {
    switch (categoryName) {
      case "정보공유": return "INFO_SHARE";
      case "자유게시판": return "FREE_BOARD";
      default: return undefined;
    }
  };

  // 커뮤니티 데이터 호출
  const apiCategory = getApiCategory(selectedCategory);
  const requestParams = {
    ...(apiCategory && { category: apiCategory }), // category가 undefined면 파라미터에서 제외
    page,
    size: 10
  };

  console.log('Request params:', {
    selectedCategory,
    apiCategory,
    requestParams,
    isLoggedIn,
    accessToken: typeof window !== 'undefined' ? window.sessionStorage.getItem('accessToken') : null
  });

  const { posts, loading, loadingMore, error, hasMore } = useCommunities(requestParams);

  // Infinite scroll logic
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    intersectionObserver.observe(observer);
    return () => intersectionObserver.disconnect();
  }, [loadMore]);


  const handleCategorySelect = (name: string) => {
    setSelectedCategory(name);
    setIsDropdownOpen(false);
    setPage(0); // 페이지 리셋
  };


  return (
    <div className="flex flex-col items-center gap-8 px-8">
     <div className="flex flex-col items-center h-[136px] gap-6 border-b border-grayScale-200">
         <div className="flex items-center justify-between  w-[1000px] h-11 ">
           <div className="w-[531px] h-[43px] flex items-center gap-4 text-[32px] font-semibold leading-none text-black">
             <div className="relative" ref={dropdownRef}>
               <div
                 className="flex items-center gap-2 cursor-pointer"
                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               >
                 <p>{selectedCategory}</p>
                 <Image
                   src="/icons/down.png"
                   alt="dropdown"
                   width={34}
                   height={34}
                   className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                 />
               </div>
     
               {/* 드롭다운 메뉴 */}
               {isDropdownOpen && (
                 <div className="absolute top-[calc(100%+16px)] left-0 w-[200px] bg-white rounded-lg shadow-lg border border-grayScale-200 overflow-hidden z-50">
                   {loading ? (
                     <div className="px-6 py-4 text-body1-regular text-grayScale-500">
                       로딩 중...
                     </div>
                   ) : (
                     category.map((categoryItem, index) => (
                       <div
                         key={categoryItem.name}
                         className={`px-6 py-4 cursor-pointer hover:bg-grayScale-50 text-body1-regular ${
                           categoryItem.name === selectedCategory ? 'text-grayScale-700 font-semibold' : 'text-grayScale-500'
                         } ${index !== category.length - 1 ? 'border-b border-grayScale-100' : ''}`}
                         onClick={() => handleCategorySelect(categoryItem.name)}
                       >
                        {categoryItem.name}
                       </div>
                     ))
                   )}
                 </div>
               )}
             </div>
             <p>커뮤니티</p>
           </div>
           {isLoggedIn && (
             <button
               className="flex items-center justify-center w-[119px] h-[43px] px-4 py-3 rounded-[55px] bg-grayScale-700 text-grayScale-white text-body1-sb whitespace-nowrap cursor-pointer"
              
             >
               게시글 작성하기
             </button>
           )}
         </div>
     
         {/* 검색 입력창 */}
         <div className="relative w-[1000px] items-center justify-center">
           <input
             type="text"
        
             className="w-full h-[44px] py-2 pl-3 pr-12 rounded-full border border-grayScale-filter text-body2-regular placeholder:text-grayScale-300"
             placeholder="전체 소모임 검색"
           />
           <Image
             src="/icons/searchIcon.png"
             alt="search"
             width={24}
             height={24}
             className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
             
           />
         </div>
       </div>

       <div className="flex flex-row gap-8 w-[1000px]">
        {/* 메인 콘텐츠 - 게시글 목록 */}
        <div className="flex-1">
          {/* 브레드크럼 */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-h1 text-black">전체</span>
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">로딩 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">오류가 발생했습니다: {error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">아직 작성된 게시글이 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">첫 번째 게시글을 작성해보세요!</p>
              </div>
            ) : (
              posts.map((post, index) => (
                <div key={`${post.id}-${index}`} className="bg-white gap-6 py-4 px-6">
                  <div className="flex flex-col items-start gap-3">
                    <h3 className="text-h2 text-black">{post.title}</h3>
                    <div className="flex flex-row justify-between w-full pb-6">
                      <div className="flex flex-row items-center gap-3">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {post.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <p className="text-body3-regular">{post.username}</p>
                        <div className="text-body3-regular text-grayScale-500">
                          {post.categoryDisplayName}
                        </div>
                      </div>
                      <p className="text-body3-regular text-grayScale-500">
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>

                  {/* 이미지 */}
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-gray-500">이미지 첨부됨</span>
                    </div>
                  )}

                  {/* 게시글 액션 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-gray-600">{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-gray-600">{post.commentsCount}</span>
                    </div>
                  </div>

                  {/* 게시글 내용 */}
                  <p className="text-gray-700">{post.content}</p>
                </div>
              ))
            )}

            {/* 무한 스크롤을 위한 Observer 요소 */}
            {hasMore && (
              <div ref={observerRef} className="py-4 text-center">
                {loadingMore ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-grayScale-700"></div>
                    <span className="ml-2 text-grayScale-500">더 많은 게시글을 불러오는 중...</span>
                  </div>
                ) : (
                  <div className="h-1"></div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 우측 사이드바 - 실시간 인기글 */}
        <div className="w-80">
          <h3 className="text-lg font-bold mb-4">실시간 인기글</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <span className="text-orange-500 font-bold text-sm">1</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-2 text-black mb-1">
                  Christmas Party in my uni
                </h4>
                <p className="text-xs text-gray-500">Buon Natale ! Oggi alla nostra università abbiamo</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <span className="text-orange-500 font-bold text-sm">2</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-2 text-black mb-1">
                  이태리 대학교 크리스마스
                </h4>
                <p className="text-xs text-gray-500">왠만에서 이태리 현지 요리 클래스 소모임에서 알게든</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <span className="text-orange-500 font-bold text-sm">3</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-2 text-black mb-1">
                  뉴욕 겨울 아이스링크 오픈
                </h4>
                <p className="text-xs text-gray-500">록펠러 센터 앞 크리스마스 트리 밑 아이스링크장 어제 개장</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <span className="text-orange-500 font-bold text-sm">4</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-2 text-black mb-1">
                  Wiener Philharmoniker
                </h4>
                <p className="text-xs text-gray-500">Das Neujahrskonzert der Wiener Philharmoniker</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
              <span className="text-orange-500 font-bold text-sm">5</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-2 text-black mb-1">
                  경북궁 한복 소모임에서 만
                </h4>
                <p className="text-xs text-gray-500">저번주 주말에 경복궁 한복대고 어제 킨이 간적 중국인 친구</p>
              </div>
            </div>
          </div>
        </div>
       </div>
    </div>
  );
}