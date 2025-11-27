"use client";

import React, { useMemo } from "react";
import { useCommunitiesPopularQuery } from "@/app/hooks/community/useCommunity";
import { ThumbsUp } from "lucide-react";

export function PopularBar() {
  const { data, isLoading, isError } = useCommunitiesPopularQuery();

  // 좋아요 수 기준으로 실시간 재정렬
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // 좋아요 수를 1순위로, 조회수를 2순위로 정렬
    return [...data].sort((a, b) => {
      if (b.likesCount !== a.likesCount) {
        return b.likesCount - a.likesCount; // 좋아요 수 내림차순
      }
      return b.viewCount - a.viewCount; // 좋아요 수가 같으면 조회수로 정렬
    });
  }, [data]);

  if (isLoading) {
    return (
      <aside className="w-[260px]">
        <div className="sticky top-8 rounded-3xl border border-gray-100 bg-white px-5 py-4 text-xs text-gray-400">
          실시간 인기글 불러오는 중...
        </div>
      </aside>
    );
  }

  if (isError) {
    return (
      <aside className="w-[260px]">
        <div className="sticky top-8 rounded-3xl border border-gray-100 bg-white px-5 py-4 text-xs text-red-400">
          실시간 인기글을 불러오지 못했어요 🥲
        </div>
      </aside>
    );
  }

  if (!sortedData || sortedData.length === 0) {
    return (
      <aside className="w-[260px]">
        <div className="sticky top-8 rounded-3xl border border-gray-100 bg-white px-5 py-4 text-xs text-gray-400">
          현재 인기글이 없어요
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[260px]">
      <div className="sticky top-8 flex flex-col rounded-3xl border border-gray-100 bg-white px-5 py-4 shadow-sm max-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* 헤더 */}
        <h3 className="mb-3 text-sm font-semibold text-gray-900 flex-shrink-0">
          실시간 인기글
        </h3>

        {/* 리스트 */}
        <div className="divide-y divide-gray-100 flex-1 min-h-0">
          {sortedData.map((post, index) => (
            <button
              key={post.id}
              type="button"
              className="flex w-full items-center gap-3 py-3 text-left hover:bg-gray-50"
            >
              {/* 순위 숫자 */}
              <span className="w-4 text-sm font-semibold text-orange-500">
                {index + 1}
              </span>

              {/* 제목 + 내용 */}
              <div className="flex-1">
                <p className="mb-1 text-sm font-medium text-gray-900 line-clamp-1">
                  {post.title}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-xs leading-snug text-gray-500 line-clamp-1 flex-1">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-orange-500 font-semibold ml-2">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{post.likesCount}</span>
                  </div>
                </div>
              </div>

              {/* 오른쪽 꺾쇠 아이콘 */}
              <span className="text-xs text-gray-300">{">"}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
