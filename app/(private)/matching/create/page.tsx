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
import type { Interest } from "@/app/api/types/matching/matching"; // ✅ payload 타입 맞추려고만 사용

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
      // meetingDate와 meetingTime을 결합하여 ISO 문자열로 변환
      if (!formData.meetingDate || !formData.meetingTime) {
        throw new Error("모임 일시를 입력해주세요.");
      }

      const meetingDateTime = new Date(formData.meetingDate);
      const [hours, minutes] = formData.meetingTime.split(":");
      meetingDateTime.setHours(parseInt(hours), parseInt(minutes));

      // ✅ 태그는 지금은 화면용이기 때문에 백엔드 interest 에는 아무것도 안 보냄
      const interests: Interest[] = [];

      // 카테고리는 기존처럼 대분류에서 1개 선택
      const categoryKey = formData.categories[0];
      const categoryString = CATEGORY_TO_STRING[categoryKey];

      const payload = {
        title: formData.name,
        description: formData.description,
        maxMember: formData.maxParticipants,
        cityId: formData.cityId,
        category: categoryString,
        interest: interests, // 현재는 빈 배열
        meetingDate: meetingDateTime.toISOString(),
        chatRoomId: 0,
      };

      // API 호출 (mutation hook 사용)
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
    formData.categories.length >= 1; // ✅ 태그는 필수 아님

  return (
    <div className="flex flex-col items-center justify-center w-[1000px] mx-auto gap-8 pt-8 pb-90">
      <div className="w-full h-[149px] flex flex-col gap-6 border-b border-grayScale-100 ">
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

      <form
        onSubmit={handleSubmit}
        className="w-full h-[1200px] flex flex-col py-[1px] gap-10"
      >
        {/* 소모임 명 */}
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

        {/* 소모임 설명 */}
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

        {/* 지역 설정 */}
        <MatchingInput
          type="search"
          label="지역 설정"
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

        {/* 모임 일시 */}
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

       {/* 모임인원 */}
<MatchingInput
  type="number"
  label="모임인원"
  required
  value={formData.maxParticipants}
  min={3}
  onChange={(value) => {
    const num = Number(value);
    
    if (isNaN(num)) return; // 숫자 아닌 입력 무시
    
    // 3 미만 입력이 들어오면 즉시 3으로 설정
    if (num < 3) {
      setFormData({
        ...formData,
        maxParticipants: 3,
      });
      return;
    }

    setFormData({
      ...formData,
      maxParticipants: num,
    });
  }}
  placeholder="숫자만 입력해주세요."
 />


        {/* 카테고리 설정 */}
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

        {/* 소모임 태그 (화면에만 보이는 텍스트 태그) */}
        <MatchingInput
          type="tag-input"
          label="소모임 태그"
          tags={formData.interests}
          onChange={(interest) =>
            setFormData({ ...formData, interests: interest as string[] })
          }
          placeholder="표시할 태그를 입력해 주세요."
          maxTags={10}
        />

        {/* 사진추가 */}
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
  );
}
