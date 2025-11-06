import React from "react"
import Image from "next/image"
export default function MatchingBar() {
  return(
  <div className="flex flex-col items-center h-[136px] gap-6 border-b border-grayScale-200">
    <div className="flex items-center justify-between  w-[1000px] h-11 ">
      <div className="w-[531px] h-[43px] flex items-center gap-2 text-[32px] font-semibold leading-none text-black">
        <div className="flex items-center gap-2">
          <p>전체</p>
          <Image
            src="/icons/down.png"
            alt="dropdown"
            width={34}
            height={34}
            className="cursor-pointer"
          />
        </div>
        <p>소모임</p>
      </div>
      <button className="flex items-center justify-center w-[119px] h-[43px] px-4 py-3 rounded-[55px] bg-grayScale-700 text-grayScale-white text-body1-sb whitespace-nowrap">소모임 만들기</button>
    </div>

    {/* 검색 입력창 */}
    <div className="relative w-[1000px] items-center justify-center">
      <input
        className="w-full h-[44px] py-2 pl-3 pr-12 rounded-full border border-grayScale-filter text-body2-regular placeholder:text-grayScale-300"
        placeholder="전체 소모임 검색"
      />
      <Image
        src="/icons/searchIcon.png"
        alt="search"
        width={24}
        height={24}
        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
      />
    </div>
  </div>
  )
}