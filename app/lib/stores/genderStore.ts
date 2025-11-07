import { create } from 'zustand';

export type Gender = 'female' | 'male' | 'other' | null;

interface GenderState {
  selectedGender: Gender;
  setSelectedGender: (gender: Gender) => void;
  clearGender: () => void;
}

export const useGenderStore = create<GenderState>((set) => ({
  selectedGender: null,
  
  setSelectedGender: (gender) => set({ selectedGender: gender }),
  
  clearGender: () => set({ selectedGender: null }),
}));

