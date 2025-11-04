import React from "react"
export default function MatchingBar() {
  return(
  <div>
    <div className="flex justify-between items-center w-full h-11 mb-4">
      <h2 className="text-h2-sb">한국 소모임</h2>
      <button className="flex items-center justify-center w-[119px] h-[43px] px-4 py-3 rounded-[55px] bg-grayScale-700 text-grayScale-white text-body1-sb whitespace-nowrap">소모임 만들기</button>
    </div>
    <div className="flex w-[1000px] h-11 gap-3">
      <button className="w-[80px] h-11 rounded-[61px] px-2 py-4 bg-grayScale-filter text-grayScale-black"></button>
      <input className="flex justify-between items-center w-[908px] h-[44px] py-2 pr-2 pl-3 rounded-full border border-grayScale-filter"></input>

    </div>
  </div>
  )
}