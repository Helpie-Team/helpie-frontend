import { create } from 'zustand';
import { City as APICity } from '@/app/api/types/location/location';

export interface SelectedCity {
  id: number;
  name: string;
  englishName: string;
  country: string;
  countryCode: string;
  fullPath: string;
}

interface CityState {
  selectedCity: SelectedCity | null;
  setSelectedCity: (city: SelectedCity | null) => void;
  clearCity: () => void;
  setCityFromAPI: (city: APICity) => void;
}

export const useCityStore = create<CityState>((set) => ({
  selectedCity: null,
  
  setSelectedCity: (city) => set({ selectedCity: city }),
  
  clearCity: () => set({ selectedCity: null }),
  
  setCityFromAPI: (city: APICity) => {
    set({
      selectedCity: {
        id: city.id,
        name: city.name,
        englishName: city.englishName,
        country: city.country.name,
        countryCode: city.country.code,
        fullPath: `${city.country.name} > ${city.name}`,
      },
    });
  },
}));

