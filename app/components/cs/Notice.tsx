import React from "react";

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  views: number;
  isNew?: boolean;
}

const mockNoticeData: NoticeItem[] = [
  {
    id: 1,
    title: "[공지] HELPie 소모임 이용 가이드",
    date: "2025-11-26",
    views: 100,
    isNew: true,
  },
  {
    id: 2,
    title: "[공지] 후기 작성 시 유의사항",
    date: "2025-11-26",
    views: 100,
    isNew: true,
  },
  {
    id: 3,
    title: "[공지] 금전거래 및 사기 피해 주의 안내",
    date: "2025-11-26",
    views: 100,
    isNew: true,
  },
  {
    id: 4,
    title: "[공지] HELPie 커뮤니티 운영정책 안내",
    date: "2020-02-05",
    views: 100,
  },
  {
    id: 5,
    title: "[공지] 운영진 계정 및 공식 채널 안내",
    date: "2025-11-26",
    views: 100,
  },
];

export default function Notice() {
  return (
    <div className="w-full">
      {mockNoticeData.map((notice) => (
        <div
          key={notice.id}
          className="py-4 border-b border-grayScale-100 hover:bg-grayScale-50 cursor-pointer"
        >
          {/* 제목 + NEW 라인 */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base md:text-body1 text-grayScale-800 font-normal leading-relaxed">
              {notice.title}
            </h3>
            {notice.isNew && (
              <span className="text-xs text-key-100 font-medium flex-shrink-0">
                NEW
              </span>
            )}
          </div>

          {/* 메타 정보 라인 */}
          <div className="mt-1 flex items-center gap-2 md:gap-4 text-xs md:text-caption text-grayScale-500">
            <span>관리자</span>
            <span>{notice.date}</span>
            <span>조회수 {notice.views}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
