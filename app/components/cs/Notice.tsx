import React from "react";

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  views: number;
}

const mockNoticeData: NoticeItem[] = [
  {
    id: 1,
    title: "[공지] 오프라인 모임 시 개인정보 공유 및 금전 거래 주의",
    date: "2025-11-25",
    views: 156,
  },
  {
    id: 2,
    title: "[안내] HELPie 소모임 이용 가이드",
    date: "2025-11-24",
    views: 243,
  },
  {
    id: 3,
    title: "[공지] 운영진 계정 및 공식 채널 안내",
    date: "2025-11-23",
    views: 189,
  },
];

export default function Notice() {
  // 한달 이내인지 체크하는 함수
  const isWithinOneMonth = (dateString: string) => {
    const noticeDate = new Date(dateString);
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    return noticeDate >= oneMonthAgo;
  };

  return (
    <div className="w-full">
      {/* 공지사항 목록 */}
      <div className="w-full">
        {mockNoticeData.map((notice) => (
          <div
            key={notice.id}
            className="flex items-center justify-between py-4 border-b border-grayScale-100 hover:bg-grayScale-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-body1 text-grayScale-800">
                {notice.title}
                {isWithinOneMonth(notice.date) && (
                  <span className="ml-2 text-sm text-key-100">
                    NEW
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-4 text-caption text-grayScale-500">
              <span>관리자</span>
              <span>{notice.date}</span>
              <span>조회수 {notice.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}