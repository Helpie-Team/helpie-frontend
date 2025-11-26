"use client";

import React from "react";
import { useCommunitiesPopularQuery } from "@/app/hooks/community/useCommunity";

export function PopularBar() {
  const { data, isLoading, isError } = useCommunitiesPopularQuery();

  if (isLoading) {
    return (
      <aside className="w-[260px]">
        <div className="rounded-3xl border border-gray-100 bg-white px-5 py-4 text-xs text-gray-400">
          실시간 인기글 불러오는 중...
        </div>
      </aside>
    );
  }

  if (isError) {
    return (
      <aside className="w-[260px]">
        <div className="rounded-3xl border border-gray-100 bg-white px-5 py-4 text-xs text-red-400">
          실시간 인기글을 불러오지 못했어요 🥲
        </div>
      </aside>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <aside className="w-[260px]">
        <div className="rounded-3xl border border-gray-100 bg-white px-5 py-4 text-xs text-gray-400">
          현재 인기글이 없어요
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[260px]">
      <div className="flex flex-col rounded-3xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        {/* 헤더 */}
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          실시간 인기글
        </h3>

        {/* 리스트 */}
        <div className="divide-y divide-gray-100">
          {data.map((post, index) => (
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
                <p className="text-xs leading-snug text-gray-500 line-clamp-2">
                  {post.content}
                </p>
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
