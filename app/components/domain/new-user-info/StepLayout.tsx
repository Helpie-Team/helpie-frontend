'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stepper } from '@/app/components/common/Stepper';
import { useStepStore } from '@/app/lib/stores/stepStore';
import { useInterestStore } from '@/app/lib/stores/interestStore';
import { useCityStore } from '@/app/lib/stores/cityStore';
import { useGenderStore } from '@/app/lib/stores/genderStore';
import { useAgeStore } from '@/app/lib/stores/ageStore';
import { useLanguageStore } from '@/app/lib/stores/languageStore';
import { submitBasicInfo } from '@/app/api/survey/survey';
import { transformGenderToAPI, transformAgeGroupToAPI, transformLanguageToAPI, transformInterestToAPI } from '@/app/lib/utils/surveyTransformers';
import BackIcon from '@/public/icons/arrow_icon.svg';
import Image from 'next/image';
interface StepLayoutProps {
  title: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  bottomAction?: React.ReactNode;
  showNextButton?: boolean;
  showBackButton?: boolean;
  onNext?: () => void;
  isNextDisabled?: boolean;
}

export default function StepLayout({
  title,
  children,
  rightAction,
  bottomAction,
  showNextButton = true,
  showBackButton = true,
  onNext,
  isNextDisabled = false,
}: StepLayoutProps) {
  const router = useRouter();
  const { prevStep, currentStep, nextStep, totalSteps, setStep } = useStepStore();
  const { selectedInterests } = useInterestStore();
  const { selectedCity } = useCityStore();
  const { selectedGender } = useGenderStore();
  const { selectedAgeRange } = useAgeStore();
  const { selectedLanguages } = useLanguageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBack = () => {
    prevStep();
  };

  // Step5에서 "프로필 완성하기" 버튼 클릭 시 API 호출
  const handleCompleteProfile = async () => {
    if (!selectedCity || !selectedGender || !selectedAgeRange || selectedLanguages.length === 0 || selectedInterests.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const requestBody = {
        cityId: selectedCity.id,
        gender: transformGenderToAPI(selectedGender),
        ageGroup: transformAgeGroupToAPI(selectedAgeRange),
        languages: selectedLanguages.map(transformLanguageToAPI),
        interests: selectedInterests.map(transformInterestToAPI),
      };

      const response = await submitBasicInfo(requestBody);
      
      // 성공 시 완료 페이지로 이동 (currentStep을 6으로 설정)
      const { setCompleted } = useStepStore.getState();
      setCompleted(response);
      setStep(6);
      
    } catch (error) {
      console.error('프로필 완성 실패:', error);
      // TODO: 에러 처리 로직 추가 (예: 에러 메시지 표시)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (isStep5) {
      handleCompleteProfile();
    } else {
      nextStep();
    }
  };

  const isLastStep = currentStep === totalSteps;
  const isStep5 = isMounted && currentStep === 5;
  const isStep6 = isMounted && currentStep === 6;
  const isStep5ButtonDisabled = isStep5 && (selectedInterests.length === 0 || isSubmitting);

  const handleGoToProfile = () => {
    router.push('/my-page');
  };

  const handleBrowseGroups = () => {
    router.push('/groups');
  };

  return (
    <div className="min-h-screen bg-white mt-[28px]">
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        {/* Header with Back Button */}
        {showBackButton && (
          <div className="relative mb-8">
            {/* Back Button - Left Top */}
            <button
              onClick={handleBack}
              className="absolute left-0 top-0 p-2 -ml-2 hover:bg-grayScale-100 rounded-full transition-colors"
              aria-label="뒤로가기"
            >
              <Image src={BackIcon} alt="back" width={24} height={24}/>
            </button>
          </div>
        )}

        {/* Title - Centered */}
        <div className="text-center mb-6">
          <h1 className="font-pretendard font-semibold text-[24px] leading-[100%] tracking-[0%] text-[var(--color-grayScale-title)]">
            {title}
          </h1>
        </div>

        {/* Right Action Button (Optional) */}
        {rightAction && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2.5 px-2 py-1 rounded-[18px] bg-[var(--color-key-100)]">
              {rightAction}
            </div>
          </div>
        )}

        {/* Stepper - Centered */}
        <div className="flex justify-center mb-12">
          <Stepper totalSteps={5} />
        </div>

        {/* Content */}
        {children}

        {/* Bottom Action - Next Button or Custom Action */}
        {bottomAction ? (
          <div className="flex justify-center pb-8 mt-12">{bottomAction}</div>
        ) : isStep6 ? (
          <div className="flex gap-3 pb-8">
            <button
              onClick={handleGoToProfile}
              className="flex-1 py-2 rounded-3xl text-body1-sb border-2 border-grayScale-300 bg-white text-grayScale-700 hover:bg-grayScale-100 transition-all"
            >
              나의 프로필로 이동
            </button>
            <button
              onClick={handleBrowseGroups}
              className="flex-1 py-2 rounded-3xl text-body1-sb bg-[var(--color-key-100)] text-white hover:opacity-90 transition-all"
            >
              소모임 둘러보기
            </button>
          </div>
        ) : isStep5 ? (
          <div className="flex justify-center pb-8 mt-12 w-full">
            <button
              onClick={handleCompleteProfile}
              disabled={isStep5ButtonDisabled}
              className={`w-full max-w-md py-4 rounded-3xl text-body1-sb transition-all ${
                !isStep5ButtonDisabled
                  ? 'bg-[var(--color-key-100)] text-white hover:opacity-90'
                  : 'bg-grayScale-300 text-grayScale-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '처리 중...' : '프로필 완성하기'}
            </button>
          </div>
        ) : (
          showNextButton && (
            <div className="flex justify-center pb-8 mt-[20rem] w-full">
              <button
                onClick={handleNext}
                disabled={isNextDisabled || isLastStep}
                className={`w-full  py-4 rounded-3xl text-body1-sb transition-all ${
                  !isNextDisabled && !isLastStep
                    ? 'bg-[var(--color-grayScale-black)] text-white hover:opacity-90'
                    : 'bg-grayScale-300 text-grayScale-500 cursor-not-allowed'
                }`}
              >
                다음으로
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

