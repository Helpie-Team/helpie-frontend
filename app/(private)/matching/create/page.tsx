"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import arrow_left from "@/public/icons/arrow_left.png";
import Image from 'next/image';
import { Input } from '@/app/components/common/Input';
export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-[1000px] gap-8">
      <div className="w-full flex flex-col gap-2">
        <button type="button" onClick={() => router.push('/matching')} className="absolute left-4 top-6">
          <Image src={arrow_left} alt="뒤로가기" width={40} height={40} />
        </button>
        <p className="text-caption1-regular text-grayScale-600">메인 &gt; 소모임</p>
        <h1>소모임 만들기</h1>
      </div>
      <div className="w-full flex flex-col gap-6">
        {/* 소모임 만들기 폼 컴포넌트가 여기에 들어갑니다 */}
        <Input label="소모임 명" placeholder="소모임 이름을 입력하세요" />
      </div>
    </div>
  );
}