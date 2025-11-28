"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCountries } from "@/app/hooks/location/useLocations";
import { isAuthenticated } from "@/app/lib/utils/token";

interface MatchingBarProps {
  onCountrySelect?: (code: string) => void;
  onSearch?: (keyword: string) => void;
}

export default function MatchingBar({ onCountrySelect, onSearch }: MatchingBarProps) {
  const router = useRouter();
  const { data: countriesData, isLoading } = useCountries();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = isAuthenticated();

  // "전체" 옵션을 포함한 국가 목록
  const countries = [
    { name: "전체", code: "ALL" },
    ...(countriesData?.result
      ?.filter((country) => country.name !== "전체")
      .map((country) => ({ name: country.name, code: country.code })) || []),
  ];

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCountrySelect = (countryName: string, countryCode: string) => {
    setSelectedCountry(countryName);
    setIsDropdownOpen(false);
    onCountrySelect?.(countryCode);
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      onSearch?.(searchKeyword.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    // 🔹 전체를 가운데 정렬
    <div className="w-full flex flex-col items-center border-b border-grayScale-200 gap-4 md:gap-6 py-4">
      {/* 🔹 상단: 국가 드롭다운 + 타이틀 + 소모임 만들기 버튼 */}
      <div className="w-full max-w-[375px] md:max-w-[1000px] flex items-center justify-between">
        {/* 왼쪽: 국가 선택 + '소모임' 텍스트 */}
        <div className="flex items-center gap-3 md:gap-4 text-[24px] md:text-[32px] font-semibold leading-none text-black">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <p>{selectedCountry}</p>
              <Image
                src="/icons/down.png"
                alt="dropdown"
                width={24}
                height={24}
                className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+12px)] left-0 w-[200px] bg-white rounded-lg shadow-lg border border-grayScale-200 overflow-hidden z-50">
                {isLoading ? (
                  <div className="px-6 py-4 text-body1-regular text-grayScale-500">
                    로딩 중...
                  </div>
                ) : (
                  countries.map((country, index) => (
                    <button
                      key={country.code || "all"}
                      type="button"
                      className={`w-full text-left px-6 py-4 cursor-pointer hover:bg-grayScale-50 text-body1-regular ${
                        country.name === selectedCountry
                          ? "text-grayScale-700 font-semibold"
                          : "text-grayScale-500"
                      } ${
                        index !== countries.length - 1
                          ? "border-b border-grayScale-100"
                          : ""
                      }`}
                      onClick={() => handleCountrySelect(country.name, country.code)}
                    >
                      {country.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <p>소모임</p>
        </div>

        {/* 오른쪽: 소모임 만들기 버튼 (로그인 시에만) */}
        {isLoggedIn && (
          <button
            type="button"
            className="
              flex items-center justify-center
              px-4 py-2 md:px-4 md:py-3
              rounded-[55px]
              bg-grayScale-700 text-grayScale-white
              text-body2-sb md:text-body1-sb
              whitespace-nowrap cursor-pointer
            "
            onClick={() => {
              router.push("/matching/create");
            }}
          >
            소모임 만들기
          </button>
        )}
      </div>

      {/* 🔹 검색 입력창 */}
      <div className="relative w-full max-w-[375px] md:max-w-[1000px]">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            w-full
            h-[40px] md:h-[44px]
            py-2 pl-3 pr-12
            rounded-full
            border border-grayScale-filter
            text-body2-regular
            placeholder:text-grayScale-300
          "
          placeholder="전체 소모임 검색"
        />
        <Image
          src="/icons/searchIcon.png"
          alt="search"
          width={24}
          height={24}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
}
