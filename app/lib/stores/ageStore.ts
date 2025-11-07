import { create } from 'zustand';

export type AgeRange = '10s' | '20s' | '30s' | '40s' | 'other' | null;

interface AgeState {
  selectedAgeRange: AgeRange;
  setSelectedAgeRange: (ageRange: AgeRange) => void;
  clearAgeRange: () => void;
}

export const useAgeStore = create<AgeState>((set) => ({
  selectedAgeRange: null,
  
  setSelectedAgeRange: (ageRange) => set({ selectedAgeRange: ageRange }),
  
  clearAgeRange: () => set({ selectedAgeRange: null }),
}));

