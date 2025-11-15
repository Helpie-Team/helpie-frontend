'use client';

import React from 'react';
import { useStepStore } from '@/app/lib/stores/stepStore';
import Step1 from '@/app/components/domain/new-user-info/steps/step1';
import Step2 from '@/app/components/domain/new-user-info/steps/Step2';
import Step3 from '@/app/components/domain/new-user-info/steps/Step3';
import Step4 from '@/app/components/domain/new-user-info/steps/Step4';
import Step5 from '@/app/components/domain/new-user-info/steps/Step5';
import ProfileComplete from '@/app/components/domain/new-user-info/ProfileComplete';

export default function NewUserInfoPage() {
  const { currentStep } = useStepStore();

  // 현재 단계에 따라 해당 컴포넌트 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      case 6:
        // 프로필 완성 단계
        return <ProfileComplete />;
      default:
        return <Step1 />;
    }
  };

  return <>{renderStep()}</>;
}
