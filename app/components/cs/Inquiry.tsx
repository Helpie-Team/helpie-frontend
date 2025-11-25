import React, { useState } from "react";

export default function Inquiry() {
  const [copied, setCopied] = useState(false);
  const email = "lifestylehelpie@gmail.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 원래 상태로 복구
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 bg-grayScale-50 rounded-2xl">

      {/* 문의 섹션 */}
      <div className="w-[769px] h-[83px] flex flex-row justify-between items-center bg-[#FAF8F7] p-6 rounded-2xl ">
        <div className="flex justify-center items-center gap-3">
          <span className="text-body1 text-grayScale-800">{email}</span>
        </div>
        <button
          onClick={handleCopyEmail}
          className="w-[60px] h-[35px] rounded-full text-body1 text-black bg-white border border-grayScale-200 cursor-pointer"
        >
          {copied ? "복사됨!" : "복사"}
        </button>
      </div>
    </div>
  );
}