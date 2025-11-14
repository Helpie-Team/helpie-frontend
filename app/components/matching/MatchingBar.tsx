"use client";
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useCountries } from "@/app/hooks/location/useLocations";

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

  // "전체" 옵션을 포함한 국가 목록
  const countries = [
    { name: "전체", code: "ALL" },
    ...(countriesData?.result?.filter(country => country.name !== "전체").map(country => ({ name: country.name, code: country.code })) || [])
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
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return(
  <div className="flex flex-col items-center h-[136px] gap-6 border-b border-grayScale-200">
    <div className="flex items-center justify-between  w-[1000px] h-11 ">
      <div className="w-[531px] h-[43px] flex items-center gap-4 text-[32px] font-semibold leading-none text-black">
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <p>{selectedCountry}</p>
            <Image
              src="/icons/down.png"
              alt="dropdown"
              width={34}
              height={34}
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="absolute top-[calc(100%+16px)] left-0 w-[200px] bg-white rounded-lg shadow-lg border border-grayScale-200 overflow-hidden z-50">
              {isLoading ? (
                <div className="px-6 py-4 text-body1-regular text-grayScale-500">
                  로딩 중...
                </div>
              ) : (
                countries.map((country, index) => (
                  <div
                    key={country.code || 'all'}
                    className={`px-6 py-4 cursor-pointer hover:bg-grayScale-50 text-body1-regular ${
                      country.name === selectedCountry ? 'text-grayScale-700 font-semibold' : 'text-grayScale-500'
                    } ${index !== countries.length - 1 ? 'border-b border-grayScale-100' : ''}`}
                    onClick={() => handleCountrySelect(country.name, country.code)}
                  >
                    {country.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <p>소모임</p>
      </div>
      <button className="flex items-center justify-center w-[119px] h-[43px] px-4 py-3 rounded-[55px] bg-grayScale-700 text-grayScale-white text-body1-sb whitespace-nowrap" onClick={()=>{router.push('/matching/create')}}>소모임 만들기</button>
    </div>

    {/* 검색 입력창 */}
    <div className="relative w-[1000px] items-center justify-center">
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-[44px] py-2 pl-3 pr-12 rounded-full border border-grayScale-filter text-body2-regular placeholder:text-grayScale-300"
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
  )
}