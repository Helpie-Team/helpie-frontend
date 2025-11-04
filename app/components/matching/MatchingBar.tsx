import React from "react"
export default function MatchingBar() {
  return( 
  <div>
    <div className="flex justify-between w-full h-11">
      <h2>한국 소모임</h2>
      <button className="w-[119px] h-[43px] px-4 py-3 g-3 rounded-[55px] bg-grayScale-700 text-grayScale-white text-body1-sb">소모임 만들기</button>
    </div>
    <div className="w-[1000px] h-11 gap-3 ">
      <button className="w-[80px] h-11 rounded-[61px] px-2 py-4 bg-grayScale-filter text-grayScale-black"></button>
      <input className="w-[908px] h-11 flex justify-between py-2 pr-2 pl-3 rounded-full border"></input>
      
    </div>
  </div>
  )
}