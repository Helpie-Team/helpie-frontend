// app/(private)/matching/create/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import arrow_left from "@/public/icons/arrow_left.png";
import {
  MatchingInput,
  CATEGORY_OPTIONS,
} from "@/app/components/matching/MatchingInput";
import { DateTimePicker } from "@/app/components/matching/DateTimePicker";
import { useCreateMatching } from "@/app/hooks/matching/useMatching";
import type { Interest } from "@/app/api/types/matching/matching";

// 카테고리 ID를 백엔드 Category enum으로 매핑
const CATEGORY_TO_STRING: Record<string, string> = {
  culture: "HOBBY",
  art: "ART",
  activity: "LIFE",
  study: "STUDY",
  social: "SOCIAL",
};

export default function Page() {
  const router = useRouter();
  const {
    mutate: createMatching,
    isPending,
    error: mutationError,
  } = useCreateMatching();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    cityId: 0,
    meetingDate: undefined as Date | undefined,
    meetingTime: "",
    maxParticipants: 0,
    categories: [] as string[], // 대분류(category)
    interests: [] as string[], // 화면에만 보이는 태그 문자열
    images: [] as File[],
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    try {
      if (!formData.meetingDate || !formData.meetingTime) {
        throw new Error("모임 일시를 입력해주세요.");
      }

      const meetingDateTime = new Date(formData.meetingDate);
      const [hours, minutes] = formData.meetingTime.split(":");
      meetingDateTime.setHours(parseInt(hours), parseInt(minutes));

      const interests: Interest[] = [];

      const categoryKey = formData.categories[0];
      const categoryString = CATEGORY_TO_STRING[categoryKey];

      const payload = {
        title: formData.name,
        description: formData.description,
        maxMember: formData.maxParticipants,
        cityId: formData.cityId,
        category: categoryString,
        interest: interests,
        meetingDate: meetingDateTime.toISOString(),
        chatRoomId: 0,
      };

      createMatching(
        {
          payload,
          images: formData.images.length > 0 ? formData.images : undefined,
        },
        {
          onSuccess: () => {
            router.push(`/matching/`);
          },
          onError: (err) => {
            console.error("소모임 생성 실패:", err);
            setValidationError(
              err instanceof Error
                ? err.message
                : "소모임 생성에 실패했습니다.",
            );
          },
        },
      );
    } catch (err) {
      console.error("유효성 검사 실패:", err);
      setValidationError(
        err instanceof Error ? err.message : "입력값을 확인해주세요.",
      );
    }
  };

  // 모든 필수 입력이 완료되었는지 확인
  const isFormValid =
    formData.name.length > 0 &&
    formData.name.length <= 13 &&
    formData.description.length >= 20 &&
    formData.description.length <= 500 &&
    formData.location.length > 0 &&
    formData.cityId > 0 &&
    formData.meetingDate !== undefined &&
    formData.meetingTime.length > 0 &&
    formData.maxParticipants >= 3 &&
    formData.categories.length >= 1;

  return (
    // 바깥에서 가운데 정렬 + PC에서 최대 1000px
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[375px] md:max-w-[1000px] px-4 md:px-0 pt-8 pb-24 flex flex-col gap-8">
        {/* ===== 모바일 헤더 (375px 시안용) ===== */}
        <div className="w-full border-b border-grayScale-100 pb-4 md:hidden">
          <div className="flex items-center justify-between">
            {/* 왼쪽 : 뒤로가기 + 타이틀 */}
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => router.push("/matching")}>
                <Image src={arrow_left} alt="뒤로가기" width={24} height={24} />
              </button>
              <h1 className="text-body1-sb">소모임 만들기</h1>
            </div>

            {/* 오른쪽 : 만들기 버튼 */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isFormValid || isPending}
              className={`h-[38px] px-4 rounded-full font-medium text-body2-medium transition-all ${
                isFormValid && !isPending
                  ? "bg-key-100 text-white hover:bg-key-200"
                  : "bg-grayScale-100 text-grayScale-400 cursor-not-allowed"
              }`}
            >
              {isPending ? "등록 중..." : "만들기"}
            </button>
          </div>
        </div>

        {/* ===== PC 헤더 (현재 디자인 유지) ===== */}
        <div className="w-full h-[149px] flex-col gap-6 border-b border-grayScale-100 hidden md:flex">
          <button type="button" onClick={() => router.push("/matching")}>
            <Image src={arrow_left} alt="뒤로가기" width={40} height={40} />
          </button>
          <div className="flex flex-col gap-2">
            <p className="text-caption1-regular text-grayScale-400">
              메인 &gt; 소모임
            </p>
            <div className="flex items-center justify-between">
              <h1 className="text-head">소모임 만들기</h1>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!isFormValid || isPending}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  isFormValid && !isPending
                    ? "bg-key-100 text-white hover:bg-key-200"
                    : "bg-grayScale-100 text-grayScale-400 cursor-not-allowed"
                }`}
              >
                {isPending ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {(validationError || mutationError) && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-body2 text-red-600">
              {validationError ||
                (mutationError instanceof Error
                  ? mutationError.message
                  : "소모임 생성에 실패했습니다.")}
            </p>
          </div>
        )}

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col py-[1px] gap-10"
        >
          <MatchingInput
            type="text"
            label="소모임 명"
            required
            value={formData.name}
            onChange={(value) =>
              setFormData({ ...formData, name: value as string })
            }
            placeholder="소모임 이름을 입력해주세요."
            maxLength={13}
            showCharCount
          />

          <MatchingInput
            type="textarea"
            label="소모임 설명"
            required
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value as string })
            }
            placeholder="간단한 설명을 입력해주세요."
            maxLength={500}
            minLength={20}
            showCharCount
          />

          <MatchingInput
            type="search"
            label="지역설정"
            required
            value={formData.location}
            onChange={(data) => {
              if (
                typeof data === "object" &&
                "cityId" in data &&
                "cityName" in data
              ) {
                setFormData({
                  ...formData,
                  location: data.cityName as string,
                  cityId: data.cityId as number,
                });
              }
            }}
            placeholder="도시를 검색하세요."
          />

          <DateTimePicker
            label="모임 일시"
            required
            dateValue={formData.meetingDate}
            timeValue={formData.meetingTime}
            onDateChange={(date) =>
              setFormData({ ...formData, meetingDate: date })
            }
            onTimeChange={(time) =>
              setFormData({ ...formData, meetingTime: time })
            }
          />

          <MatchingInput
            type="number"
            label="모임인원"
            required
            value={formData.maxParticipants}
            min={3}
            onChange={(value) => {
              const num = Number(value);
              if (isNaN(num)) return;
              setFormData({
                ...formData,
                maxParticipants: num < 3 ? 3 : num,
              });
            }}
            placeholder="숫자만 입력해주세요."
          />

          <MatchingInput
            type="tags"
            label="카테고리 설정"
            required
            selectedTags={formData.categories}
            onChange={(tags) =>
              setFormData({ ...formData, categories: tags as string[] })
            }
            options={CATEGORY_OPTIONS}
          />

          <MatchingInput
            type="tag-input"
            label="태그"
            tags={formData.interests}
            onChange={(interest) =>
              setFormData({ ...formData, interests: interest as string[] })
            }
            placeholder="태그 내용 입력 후 엔터 혹은 스페이스바"
            maxTags={10}
          />

          <MatchingInput
            type="image"
            images={formData.images}
            onChange={(images) =>
              setFormData({ ...formData, images: images as File[] })
            }
            maxImages={3}
          />
        </form>
      </div>
    </div>
  );
}
