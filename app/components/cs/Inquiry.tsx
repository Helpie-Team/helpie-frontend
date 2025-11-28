import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Inquiry() {
  const email = "lifestylehelpie@gmail.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("복사되었습니다!");
    } catch (err) {
      console.error("복사 실패:", err);
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 카드 래퍼: 모바일은 전체, PC는 769px로 가운데 정렬 */}
      <div className="w-full max-w-[769px]">
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#FAF8F7] px-4 py-4 md:px-6 md:py-5">
          <span className="text-body1 text-grayScale-800 break-all">
            {email}
          </span>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="ml-4 flex h-9 min-w-[60px] items-center justify-center rounded-full border border-grayScale-200 bg-white px-4 text-body2-regular text-black"
          >
            복사
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
      />
    </div>
  );
}
