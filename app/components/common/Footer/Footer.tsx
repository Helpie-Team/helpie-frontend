"use client";

import React, { useState} from "react";
import { usePathname, useRouter } from "next/navigation";
import logoFooter from "@/public/logoFooter.png";
import instagramFooter from "@/public/icons/instagramFooter.png";
import twitterFooter from "@/public/icons/twitterFooter.png";
import blogFooter from "@/public/icons/blogFooter.png";
import Image from "next/image";


export default function Footer() {
  const [language, setLanguage] = useState("한국어");
  const router=useRouter();
  const pathname = usePathname();
  const isUserInfoPage = pathname === '/new-user-info';
  if (isUserInfoPage) {
    return null;
  }
  return (
    isUserInfoPage ? (
      <></>
    ) : (
      <>  
    <div className="w-full min-w-[900px] bg-[#FAF8F7] flex flex-col items-center justify-center py-16 px-8">
      <div className="w-[1000px] flex flex-col gap-12">
        {/* 상단 영역 */}
        <div className="flex flex-row justify-between items-start">
          {/* 로고 및 SNS */}
          <div className="flex flex-col gap-6">
            <Image src={logoFooter} alt="헬피 로고" width={110} height={28} />
            <div className="flex gap-3">
              <Image
                src={instagramFooter}
                alt="인스타 아이콘"
                width={24}
                height={24}
                className="cursor-pointer"
              />
              <Image
                src={twitterFooter}
                alt="트위터 아이콘"
                width={24}
                height={24}
                className="cursor-pointer"
              />
              <Image
                src={blogFooter}
                alt="블로그 아이콘"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* 메뉴 섹션 */}
          <div className="flex gap-24">
            {/* About */}
            <div className="flex flex-col gap-4">
              <h3 className="text-h3 text-grayScale-500">About</h3>
              <a href="#" className="text-h3-regular text-black hover:underline">
                헬피란 무엇인가요?
              </a>
            </div>

            {/* 탐색 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-h3 text-grayScale-500">탐색</h3>
              <div className="flex flex-col gap-3">
                <a href="#" className="text-h3-regular text-black hover:underline" onClick={() => router.push('/matching')}>
                  소모임
                </a>
                <a href="#" className="text-h3-regular text-black hover:underline">
                  커뮤니티
                </a>
              </div>
            </div>

            {/* 고객센터 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-h3 text-grayScale-500">고객센터</h3>
              <div className="flex flex-col gap-3">
                <a href="#" className="text-h3-regular text-black hover:underline">
                  공지사항
                </a>
                <a href="#" className="text-h3-regular text-black hover:underline">
                  문의하기
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 영역 */}
        <div className="flex justify-between items-center pt-8 border-t border-grayScale-200">
          <p className="text-h3-sb text-black">2025 helpie</p>

          <div className="flex items-center gap-4">
            {/* 언어 선택 */}
            <select
              title="언어 선택"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-h3-regular text-black bg-transparent border-none cursor-pointer outline-none"
            >
              <option value="한국어">한국어</option>
              <option value="English">English</option>
            </select>

            <span className="text-grayScale-300">|</span>

            <a href="#" className="text-h3-regular text-black hover:underline">
              이용약관
            </a>

            <span className="text-grayScale-300">|</span>

            <a href="#" className="text-h3-regular text-black hover:underline">
              개인정보 처리방침
            </a>
          </div>
        </div>
      </div>
    </div>
    </>)
  );
}