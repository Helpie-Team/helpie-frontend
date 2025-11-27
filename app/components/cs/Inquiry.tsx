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
          복사
        </button>
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