"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

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

  if (isUserInfoPage) return null;

  const languages = [
    { label: "한국어", value: "ko" },
    { label: "English", value: "en" },
  ];

  const selectedLabel =
    languages.find((lang) => lang.value === selectedLang)?.label ?? "한국어";

  const handleSelect = (value: "ko" | "en") => {
    setSelectedLang(value);
    setIsOpen(false);
  };

  return (
    <div className="w-full bg-[#FAF8F7] flex justify-center py-8 md:py-16 px-4 md:px-8">
      <div className="w-full max-w-5xl flex flex-col gap-8 md:gap-12">
        {/* ================= 상단 : 모바일 전용 ================= */}
        <div className="flex w-full flex-col gap-6 md:hidden">
          {/* 로고 + SNS (모바일) */}
          <div className="flex w-full items-center justify-between">
            <Image
              src={logoFooter}
              alt="헬피 로고"
              width={110}
              height={28}
              className="w-24 h-auto"
            />

            <div className="flex gap-3">
              <a
                href="https://instagram.com/your_helpie"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={instagramFooter}
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-6 h-6 cursor-pointer hover:opacity-80"
                />
              </a>
              <a
                href="https://twitter.com/your_helpie"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={twitterFooter}
                  alt="Twitter"
                  width={24}
                  height={24}
                  className="w-6 h-6 cursor-pointer hover:opacity-80"
                />
              </a>
              <a
                href="https://blog.naver.com/your_helpie"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={blogFooter}
                  alt="Blog"
                  width={24}
                  height={24}
                  className="w-6 h-6 cursor-pointer hover:opacity-80"
                />
              </a>
            </div>
          </div>

          {/* 메뉴 (모바일) */}
          <div className="flex w-full flex-col gap-6">
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

            {/* 탐색 & 고객센터 2열 */}
            <div className="flex flex-row gap-8">
              <div className="flex flex-col gap-4 flex-1">
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

              <div className="flex flex-col gap-4 flex-1">
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
        </div>

        {/* ================= 상단 : PC 전용 ================= */}
        <div className="hidden md:flex w-full flex-row justify-between">
          {/* 왼쪽 : 로고 + SNS(세로 정렬) */}
          <div className="flex flex-col gap-4">
            <Image
              src={logoFooter}
              alt="헬피 로고"
              width={110}
              height={28}
              className="w-28 h-auto"
            />

            <div className="flex gap-3">
              <a
                href="https://instagram.com/your_helpie"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={instagramFooter}
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-6 h-6 cursor-pointer hover:opacity-80"
                />
              </a>
              <a
                href="https://twitter.com/your_helpie"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={twitterFooter}
                  alt="Twitter"
                  width={24}
                  height={24}
                  className="w-6 h-6 cursor-pointer hover:opacity-80"
                />
              </a>
              <a
                href="https://blog.naver.com/your_helpie"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={blogFooter}
                  alt="Blog"
                  width={24}
                  height={24}
                  className="w-6 h-6 cursor-pointer hover:opacity-80"
                />
              </a>
            </div>
          </div>

          {/* 오른쪽 : About / 탐색 / 고객센터 3컬럼 */}
          <div className="flex flex-row gap-12 lg:gap-24">
            <div className="flex flex-col gap-4">
              <h3 className="text-h3 text-grayScale-500">About</h3>
              <Link
                href="/about"
                className="text-h3-regular text-black hover:underline"
              >
                헬피란 무엇인가요?
              </Link>
            </div>

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

        {/* ================= 하단 공통 : 2025 + 언어/약관 ================= */}
        <div
          className="
            w-full
            flex flex-col-reverse md:flex-row
            items-start md:items-center
            justify-start md:justify-between
            gap-4 md:gap-0
            pt-6 md:pt-8
          "
        >
          {/* 왼쪽(모바일에서는 아래) */}
          <p className="text-h3-sb text-black">2025 helpie</p>

          {/* 오른쪽 : 언어 + 약관 */}
          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-2 md:gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center py-1 cursor-pointer hover:opacity-80"
              >
                <span>{selectedLabel}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 bg-white shadow-md rounded-2xl border border-grayScale-200 w-32 md:w-40 overflow-hidden z-50">
                  {languages.map((lang, idx) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() =>
                        handleSelect(lang.value as "ko" | "en")
                      }
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                        selectedLang === lang.value ? "font-semibold" : ""
                      } ${
                        idx !== 0 ? "border-t border-grayScale-200" : ""
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-grayScale-300">|</span>
            <button type="button" className="hover:underline">
              이용약관
            </button>
            <span className="text-grayScale-300">|</span>
            <button type="button" className="hover:underline">
              개인정보 처리방침
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
