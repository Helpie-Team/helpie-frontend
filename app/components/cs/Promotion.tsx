import React from "react";

interface PromotionItem {
  id: number;
  title: string;
  date: string;
  views: number;
}

const mockPromotionData: PromotionItem[] = [
  {
    id: 1,
    title: "[이벤트] HELPie × CITY PASS 여행지원 프로모션 안내",
    date: "2025-11-25",
    views: 324,
  },
  {
    id: 2,
    title: "[선착순] HELPie × Travel On Card 혜택 등록 이벤트",
    date: "2025-11-24",
    views: 512,
  },
  {
    id: 3,
    title: "[특별] HELPie × ECHO 글로벌 라이프 서포트 기획전",
    date: "2025-11-23",
    views: 298,
  },
];

export default function Promotion() {
  const isWithinOneMonth = (dateString: string) => {
    const noticeDate = new Date(dateString);
    const currentDate = new Date();
    const oneMonthAgo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate()
    );
    return noticeDate >= oneMonthAgo;
  };

  return (
    <div className="w-full">
      {mockPromotionData.map((promotion) => (
        <div
          key={promotion.id}
          className="py-4 border-b border-grayScale-100 hover:bg-grayScale-50 cursor-pointer"
        >
          {/* 제목 + NEW 라인 */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-base md:text-body1 w-[240px] text-grayScale-800 font-normal leading-relaxed">
              {promotion.title}
            </span>
            {isWithinOneMonth(promotion.date) && (
              <span className="text-xs text-key-100 font-medium flex-shrink-0">
                NEW
              </span>
            )}
          </div>

          {/* 메타 정보 라인 */}
          <div className="mt-1 flex items-center gap-2 md:gap-4 text-xs md:text-caption text-grayScale-500">
            <span>관리자</span>
            <span>{promotion.date}</span>
            <span>조회수 {promotion.views}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
