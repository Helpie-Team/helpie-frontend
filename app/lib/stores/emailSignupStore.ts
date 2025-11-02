import { create } from 'zustand';

export type EmailSignupStep = 'email' | 'verification' | 'signup';

interface EmailSignupState {
  step: EmailSignupStep;
  email: string;
  verificationCode: string;
  username: string;
  setStep: (step: EmailSignupStep) => void;
  setEmail: (email: string) => void;
  setVerificationCode: (code: string) => void;
  setUsername: (username: string) => void;
  reset: () => void;
}

const initialState = {
  step: 'email' as EmailSignupStep,
  email: '',
  verificationCode: '',
  username: '',
};

export const useEmailSignupStore = create<EmailSignupState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ step }),
  
  setEmail: (email) => set({ email }),
  
  setVerificationCode: (code) => set({ verificationCode: code }),
  
  setUsername: (username) => set({ username }),
  
  reset: () => set(initialState),
}));

