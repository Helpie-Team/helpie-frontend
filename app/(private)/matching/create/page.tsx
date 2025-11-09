"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import arrow_left from "@/public/icons/arrow_left.png";
import Image from 'next/image';
import { MatchingInput, CATEGORY_OPTIONS } from '@/app/components/matching/MatchingInput';

export default function Page() {
  const router = useRouter();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    maxParticipants: 0,
    categories: [] as string[],
    tags: [] as string[],
    images: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  // 모든 필수 입력이 완료되었는지 확인
  const isFormValid =
    formData.name.length > 0 && formData.name.length <= 13 &&
    formData.description.length >= 20 && formData.description.length <= 500 &&
    formData.location.length > 0 &&
    formData.maxParticipants >= 3 &&
    formData.categories.length >= 1 &&
    formData.tags.length > 0;

  return (
    <div className="flex flex-col items-center justify-center w-[1000px] gap-8 pt-8 pb-90">
      <div className="w-full h-[149px] flex flex-col gap-6 border-b border-grayScale-100 ">
        <button type="button" onClick={() => router.push('/matching')}>
          <Image src={arrow_left} alt="뒤로가기" width={40} height={40} />
        </button>
        <div className="flex flex-col gap-2">
        <p className="text-caption1-regular text-grayScale-400">메인 &gt; 소모임</p>
        <div className="flex items-center justify-between">
          <h1 className="text-head">소모임 만들기</h1>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              isFormValid
                ? 'bg-key-100 text-white'
                : 'bg-grayScale-100 text-grayScale-400 cursor-not-allowed'
            }`}
          >
            등록하기
          </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full h-[1200px] flex flex-col py-[1px] gap-10">
        {/* 소모임 명 */}
        <MatchingInput
          type="text"
          label="소모임 명"
          required
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value as string })}
          placeholder="소모임 이름을 입력해주세요."
          maxLength={13}
          showCharCount
        />

        {/* 소모임 설명 */}
        <MatchingInput
          type="textarea"
          label="소모임 설명"
          required
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value as string })}
          placeholder="간단한 설명을 입력해주세요."
          maxLength={500}
          minLength={20}
          showCharCount
        />

        {/* 지역 설정 */}
        <MatchingInput
          type="search"
          label="지역 설정"
          required
          value={formData.location}
          onChange={(location) => setFormData({ ...formData, location: location as string })}
          placeholder="도시를 검색하세요."
        />

        {/* 모임 일시 - shadcn으로 구현 예정 */}

        {/* 모임인원 */}
        <MatchingInput
          type="number"
          label="모임인원"
          required
          value={formData.maxParticipants}
          onChange={(value) => setFormData({ ...formData, maxParticipants: value as number })}
          placeholder="숫자만 입력해 주세요."
        />

        {/* 카테고리 설정 */}
        <MatchingInput
          type="tags"
          label="카테고리 설정"
          required
          selectedTags={formData.categories}
          onChange={(tags) => setFormData({ ...formData, categories: tags as string[] })}
          options={CATEGORY_OPTIONS}
        />

        {/* 소모임 태그 */}
        <MatchingInput
          type="tag-input"
          label="소모임 태그"
          required
          tags={formData.tags}
          onChange={(tags) => setFormData({ ...formData, tags: tags as string[] })}
          placeholder="표시할 태그를 입력해 주세요."
          maxTags={10}
        />

        {/* 사진추가 */}
        <MatchingInput
          type="image"
          images={formData.images}
          onChange={(images) => setFormData({ ...formData, images: images as File[] })}
          maxImages={3}
        />
      </form>
    </div>
  );
}