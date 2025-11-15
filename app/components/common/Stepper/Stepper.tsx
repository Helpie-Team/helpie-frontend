'use client';

import React from 'react';
import { useStepStore } from '../../../lib/stores/stepStore';

interface StepperProps {
  totalSteps?: number;
}

export default function Stepper({ totalSteps = 5 }: StepperProps) {
  const { currentStep } = useStepStore();

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;

        return (
          <div
            key={stepNumber}
            className="flex items-center justify-center"
          >
            {isActive ? (
              /* Active Step: Capsule shape (pill/bar) */
              <div className="w-20 h-2 rounded-full bg-[var(--color-key-200)] transition-all duration-500 ease-in-out" />
            ) : (
              /* Inactive Step: Small circle dot */
              <div className="w-2 h-2 rounded-full bg-[var(--color-grayScale-300)] transition-all duration-500 ease-in-out" />
            )}
          </div>
        );
      })}
    </div>
  );
}
