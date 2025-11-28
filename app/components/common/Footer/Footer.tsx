"use client";

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

  if (isUserInfoPage) return null;

  return (
    <div className="w-full bg-[#FAF8F7] flex justify-center py-8 sm:py-16 px-4 sm:px-8">
      <div className="w-full max-w-5xl flex flex-col gap-8 sm:gap-12">
        <div className="flex w-full flex-col gap-6 sm:hidden">
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
        <div className="hidden sm:flex w-full flex-row justify-between">
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
          <div className="flex flex-row gap-12 sm:gap-24">
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

        <div
          className="
            w-full
            flex flex-col-reverse sm:flex-row
            items-start sm:items-center
            justify-start sm:justify-between
            gap-4 sm:gap-0
            pt-6 sm:pt-8
          "
        >
          <p className="text-h3-sb text-black">2025 helpie</p>

          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 sm:gap-4">
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
