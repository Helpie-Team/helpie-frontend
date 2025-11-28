"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Notice from "@/app/components/cs/Notice";
import Promotion from "@/app/components/cs/Promotion";
import Inquiry from "@/app/components/cs/Inquiry";
import arrow_left from "@/public/icons/arrow_left.png";

export default function Page() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<"notice" | "inquiry">("notice");
  const [activeTab, setActiveTab] = useState<"notice" | "promotion">("notice");

  const sidebarMenus = [
    { id: "notice" as const, label: "공지사항" },
    { id: "inquiry" as const, label: "문의" },
  ];

  const noticeTabs = [
    { id: "notice" as const, label: "공지사항" },
    { id: "promotion" as const, label: "프로모션" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 모바일 헤더 - border-b 제거 */}
      <div className="md:hidden flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center"
          >
            <Image src={arrow_left} alt="뒤로가기" width={24} height={24} />
          </button>
          <h1 className="text-lg font-semibold text-black">고객센터</h1>
        </div>
      </div>

      {/* PC 헤더 */}
      <div className="hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <h1 className="text-head text-black mb-8 border-b border-grayScale-100 pb-4">
            고객센터
          </h1>
        </div>
      </div>

      <div className="md:max-w-[1200px] md:mx-auto md:px-4 md:pb-8">
        {/* 모바일 탭 네비게이션 */}
        <div className="md:hidden flex border-b border-grayScale-200">
          <button
            onClick={() => setActiveMenu("notice")}
            className={`flex-1 py-4 text-center transition-colors border-b-2 ${
              activeMenu === "notice"
                ? "text-key-100 border-key-100"
                : "text-grayScale-600 border-transparent"
            }`}
          >
            공지
          </button>
          <button
            onClick={() => setActiveMenu("inquiry")}
            className={`flex-1 py-4 text-center transition-colors border-b-2 ${
              activeMenu === "inquiry"
                ? "text-key-100 border-key-100"
                : "text-grayScale-600 border-transparent"
            }`}
          >
            문의
          </button>
        </div>

        {/* 모바일 콘텐츠 */}
        <div className="md:hidden">
          {activeMenu === "notice" && (
            <div className="p-4">
              {/* 필터 버튼 */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setActiveTab("notice")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "notice"
                      ? "bg-black text-white"
                      : "bg-white text-grayScale-600 border border-grayScale-200"
                  }`}
                >
                  공지사항
                </button>
                <button
                  onClick={() => setActiveTab("promotion")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "promotion"
                      ? "bg-black text-white"
                      : "bg-white text-grayScale-600 border border-grayScale-200"
                  }`}
                >
                  프로모션
                </button>
              </div>

              {/* 콘텐츠 */}
              {activeTab === "notice" ? <Notice /> : <Promotion />}
            </div>
          )}

          {activeMenu === "inquiry" && (
            <div className="p-4">
              <Inquiry />
            </div>
          )}
        </div>

        {/* PC 레이아웃 */}
        <div className="hidden md:flex gap-8">
          <div className="w-[240px] flex flex-col">
            {sidebarMenus.map((menu, index) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`px-4 py-4 text-left text-h4 transition-colors flex items-center justify-between bg-white border border-grayScale-200 ${
                  activeMenu === menu.id
                    ? "text-key-100 bg-key-10"
                    : "text-grayScale-800 hover:text-key-100 hover:bg-grayScale-50"
                } ${index === 0 ? "rounded-t-2xl" : ""} ${
                  index === sidebarMenus.length - 1
                    ? "rounded-b-2xl"
                    : "-mb-px"
                }`}
              >
                <span>{menu.label}</span>
                <svg
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                  className={`transition-colors ${
                    activeMenu === menu.id
                      ? "text-key-100"
                      : "text-grayScale-400"
                  }`}
                >
                  <path
                    d="M1 1L6 6L1 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>

          <div className="flex-1">
            <h2 className="text-h2 text-black mb-6">
              {activeMenu === "notice" ? "공지사항" : "문의"}
            </h2>

            {activeMenu === "notice" ? (
              <div className="w-full flex flex-col gap-4">
                <div className="flex">
                  {noticeTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-[378px] py-4 text-h3 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "text-key-100 border-key-100"
                          : "text-grayScale-600 border-grayScale-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  {activeTab === "notice" ? <Notice /> : <Promotion />}
                </div>
              </div>
            ) : (
              <Inquiry />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
