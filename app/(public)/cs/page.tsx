"use client";

import React, { useState } from "react";
import Notice from "@/app/components/cs/Notice";
import Promotion from "@/app/components/cs/Promotion";
import Inquiry from "@/app/components/cs/Inquiry";

export default function Page() {
  const [activeMenu, setActiveMenu] = useState<"notice" | "inquiry">("notice");
  const [activeTab, setActiveTab] = useState<"notice" | "promotion">("notice");

  const sidebarMenus = [
    { id: "notice" as const, label: "공지사항" },
    { id: "inquiry" as const, label: "문의" },
  ];

  const noticeTabs = [
    { id: "notice" as const, label: "공지" },
    { id: "promotion" as const, label: "프로모션" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-head text-black mb-8 border-b border-grayScale-100 pb-4">고객센터</h1>

        <div className="flex gap-8">
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
                  index === sidebarMenus.length - 1 ? "rounded-b-2xl" : "-mb-px"
                }`}
              >
                <span>{menu.label}</span>
                <svg
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                  className={`transition-colors ${
                    activeMenu === menu.id ? "text-key-100" : "text-grayScale-400"
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