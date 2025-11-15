import { create } from 'zustand';

interface InterestState {
  selectedInterests: string[];
  toggleInterest: (interest: string) => void;
  setInterests: (interests: string[]) => void;
  clearInterests: () => void;
}

export const useInterestStore = create<InterestState>((set, get) => ({
  selectedInterests: [],
  
  toggleInterest: (interest) => {
    const { selectedInterests } = get();
    if (selectedInterests.includes(interest)) {
      set({ selectedInterests: selectedInterests.filter((i) => i !== interest) });
    } else {
      set({ selectedInterests: [...selectedInterests, interest] });
    }
  },

  setInterests: (interests) => {
    set({ selectedInterests: interests });
  },
  
  clearInterests: () => {
    set({ selectedInterests: [] });
  },
}));

