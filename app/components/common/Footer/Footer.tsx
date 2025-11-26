"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import logoFooter from "@/public/logoFooter.png";
import instagramFooter from "@/public/icons/instagramFooter.png";
import twitterFooter from "@/public/icons/twitterFooter.png";
import blogFooter from "@/public/icons/blogFooter.png";

export default function Footer() {
  const pathname = usePathname();
  const isUserInfoPage = pathname === "/new-user-info";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"ko" | "en">("ko");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 해당 페이지에서는 푸터 숨김
  if (isUserInfoPage) return null;

  const languages: { label: string; value: "ko" | "en"; display: string }[] = [
    { label: "한국어", value: "ko", display: "한국어" },
    { label: "English", value: "en", display: "English" },
  ];



  const handleSelect = (value: "ko" | "en") => {
    setSelectedLang(value);
    setIsOpen(false);
    // TODO: 여기서 실제 언어 변경 로직(i18n 등) 연결하면 됨
  };

  const selectedLabel =
    languages.find((lang) => lang.value === selectedLang)?.display ??
    "한국어 (KR)";

  return (
    <div className="w-full min-w-[900px] bg-[#FAF8F7] flex flex-col items-center justify-center py-16 px-8">
      <div className="w-[1000px] flex flex-col gap-12">
        {/* 상단 영역 */}
        <div className="flex flex-row justify-between items-start">
          {/* 로고 및 SNS */}
          <div className="flex flex-col gap-6">
            <Image src={logoFooter} alt="헬피 로고" width={110} height={28} />

            <div className="flex gap-3">
              <a
                href="https://instagram.com/your_helpie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="헬피 인스타그램으로 이동"
              >
                <Image
                  src={instagramFooter}
                  alt="인스타 아이콘"
                  width={24}
                  height={24}
                  className="cursor-pointer hover:opacity-80 transition"
                />
              </a>

              <a
                href="https://twitter.com/your_helpie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="헬피 트위터로 이동"
              >
                <Image
                  src={twitterFooter}
                  alt="트위터 아이콘"
                  width={24}
                  height={24}
                  className="cursor-pointer hover:opacity-80 transition"
                />
              </a>

              <a
                href="https://blog.naver.com/your_helpie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="헬피 블로그로 이동"
              >
                <Image
                  src={blogFooter}
                  alt="블로그 아이콘"
                  width={24}
                  height={24}
                  className="cursor-pointer hover:opacity-80 transition"
                />
              </a>
            </div>
          </div>

          {/* 메뉴 섹션 */}
          <div className="flex gap-24">
            {/* About */}
            <div className="flex flex-col gap-4">
              <h3 className="text-h3 text-grayScale-500">About</h3>
              <Link
                href="/about"
                className="text-h3-regular text-black hover:underline"
              >
                헬피란 무엇인가요?
              </Link>
            </div>

            {/* 탐색 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-h3 text-grayScale-500">탐색</h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/matching"
                  className="text-h3-regular text-black hover:underline"
                >
                  소모임
                </Link>
                <Link
                  href="/community"
                  className="text-h3-regular text-black hover:underline"
                >
                  커뮤니티
                </Link>
              </div>
            </div>

            {/* 고객센터 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-h3 text-grayScale-500">고객센터</h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/cs"
                  className="text-h3-regular text-black hover:underline"
                >
                  공지사항
                </Link>
                <Link
                  href="/cs"
                  className="text-h3-regular text-black hover:underline"
                >
                  문의하기
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 영역 */}
        <div className="flex justify-between items-center pt-8 border-t border-grayScale-200">
          <p className="text-h3-sb text-black">2025 helpie</p>

          <div className="flex items-center gap-4">
            {/* 언어 선택 - 커스텀 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="text-h3-regular text-black bg-transparent cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 transition flex items-center"
              >
                {selectedLabel}
              </button>

              {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 bg-white shadow-md rounded-2xl border border-grayScale-200 w-40 overflow-hidden z-50">
                  {languages.map((lang, index) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => handleSelect(lang.value)}
                      className={`w-full text-left px-4 py-3 text-h3-regular hover:bg-gray-50 ${
                        selectedLang === lang.value ? "font-semibold" : ""
                      } ${index !== 0 ? "border-t border-grayScale-200" : ""}`}
                    >
                      {lang.display}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-grayScale-300">|</span>

            <button
              type="button"
              className="text-h3-regular text-black hover:underline"
            >
              이용약관
            </button>

            <span className="text-grayScale-300">|</span>

            <button
              type="button"
              className="text-h3-regular text-black hover:underline"
            >
              개인정보 처리방침
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
