import { create } from 'zustand';
import { BasicInfoResponseData } from '@/app/api/types/survey/survey';

interface StepState {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  profileData: BasicInfoResponseData | null;
  hasBasicInfo: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setCompleted: (profileData: BasicInfoResponseData) => void;
  setProfileData: (profileData: BasicInfoResponseData | null) => void;
  setHasBasicInfo: (hasBasicInfo: boolean) => void;
}

export const useStepStore = create<StepState>((set, get) => ({
  currentStep: 1,
  totalSteps: 5,
  isCompleted: false,
  profileData: null,
  hasBasicInfo: false,
  
  setStep: (step) => {
    const { totalSteps } = get();
    if (step >= 1 && step <= totalSteps + 1) {
      set({ currentStep: step });
    }
  },
  
  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  reset: () => {
    set({ currentStep: 1, isCompleted: false, profileData: null, hasBasicInfo: false });
  },
  
  setCompleted: (profileData) => {
    set({ isCompleted: true, profileData, hasBasicInfo: true });
  },

  setProfileData: (profileData) => {
    set({ profileData });
  },

  setHasBasicInfo: (hasBasicInfo) => {
    set({ hasBasicInfo });
  },
}));

