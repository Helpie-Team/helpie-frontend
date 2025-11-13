import { create } from 'zustand';

export type Language = 'korean' | 'english' | 'chinese' | 'japanese' | 'spanish' | 'french';

interface LanguageState {
  selectedLanguages: Language[];
  toggleLanguage: (language: Language) => void;
  setLanguages: (languages: Language[]) => void;
  clearLanguages: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  selectedLanguages: [],
  
  toggleLanguage: (language) => {
    const { selectedLanguages } = get();
    if (selectedLanguages.includes(language)) {
      set({ selectedLanguages: selectedLanguages.filter((lang) => lang !== language) });
    } else {
      set({ selectedLanguages: [...selectedLanguages, language] });
    }
  },

  setLanguages: (languages) => {
    set({ selectedLanguages: languages });
  },
  
  clearLanguages: () => {
    set({ selectedLanguages: [] });
  },
}));

