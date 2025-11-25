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
  // 한달 이내인지 체크하는 함수
  const isWithinOneMonth = (dateString: string) => {
    const noticeDate = new Date(dateString);
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    return noticeDate >= oneMonthAgo;
  };

  return (
    <div className="w-full">
      {/* 프로모션 목록 */}
      <div className="w-full">
        {mockPromotionData.map((promotion) => (
          <div
            key={promotion.id}
            className="flex items-center justify-between py-4 border-b border-grayScale-100 hover:bg-grayScale-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-body1 text-grayScale-800">
                {promotion.title}
                {isWithinOneMonth(promotion.date) && (
                  <span className="ml-2 text-sm text-key-100">
                    NEW
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-4 text-caption text-grayScale-500">
              <span>관리자</span>
              <span>{promotion.date}</span>
              <span>조회수 {promotion.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}