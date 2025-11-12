import { Gender } from '@/app/lib/stores/genderStore';
import { AgeRange } from '@/app/lib/stores/ageStore';
import { Language } from '@/app/lib/stores/languageStore';

/**
 * 설문조사 데이터를 API 요청/응답 형식으로 변환하는 유틸리티 함수들
 */

const GENDER_TO_API: Record<Exclude<Gender, null>, 'MALE' | 'FEMALE' | 'OTHER'> = {
  male: 'MALE',
  female: 'FEMALE',
  other: 'OTHER',
};

const GENDER_FROM_API: Record<string, Gender> = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

export const transformGenderToAPI = (gender: Gender | string): 'MALE' | 'FEMALE' | 'OTHER' => {
  if (!gender) return 'OTHER';
  const normalized = typeof gender === 'string' ? gender.toLowerCase() : gender;
  return GENDER_TO_API[normalized as Exclude<Gender, null>] || 'OTHER';
};

export const transformGenderFromAPI = (gender: string | null | undefined): Gender => {
  if (!gender) return null;
  return GENDER_FROM_API[gender] ?? null;
};

const AGE_TO_API: Record<Exclude<AgeRange, null>, 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'OTHER'> = {
  '10s': 'TEENS',
  '20s': 'TWENTIES',
  '30s': 'THIRTIES',
  '40s': 'FORTIES',
  other: 'OTHER',
};

const AGE_FROM_API: Record<string, AgeRange> = {
  TEENS: '10s',
  TWENTIES: '20s',
  THIRTIES: '30s',
  FORTIES: '40s',
  OTHER: 'other',
};

export const transformAgeGroupToAPI = (ageRange: AgeRange | string): 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'OTHER' => {
  if (!ageRange) return 'OTHER';
  return AGE_TO_API[ageRange as Exclude<AgeRange, null>] || 'OTHER';
};

export const transformAgeGroupFromAPI = (ageGroup: string | null | undefined): AgeRange => {
  if (!ageGroup) return null;
  return AGE_FROM_API[ageGroup] ?? null;
};

const LANGUAGE_TO_API: Record<Language, string> = {
  korean: 'KOREAN',
  english: 'ENGLISH',
  chinese: 'CHINESE',
  japanese: 'JAPANESE',
  spanish: 'SPANISH',
  french: 'FRENCH',
};

const LANGUAGE_FROM_API = Object.fromEntries(
  Object.entries(LANGUAGE_TO_API).map(([key, value]) => [value, key])
) as Record<string, Language>;

export const transformLanguageToAPI = (language: Language | string): string => {
  if (!language) return '';
  return LANGUAGE_TO_API[language as Language] || language.toUpperCase();
};

export const transformLanguageFromAPI = (language: string | null | undefined): Language | null => {
  if (!language) return null;
  return LANGUAGE_FROM_API[language] ?? null;
};

const INTEREST_TO_API: Record<string, string> = {
  movie: 'MOVIE_WATCHING',
  music: 'MUSIC_LISTENING',
  drama: 'DRAMA',
  diary: 'DIARY',
  ott: 'OTT_VIEWING',
  writing: 'WRITING',
  reading: 'READING',
  baking: 'BAKING',
  cooking: 'HEALTHY_COOKING',
  photography: 'PHOTOGRAPHY',
  diy: 'DIY_CRAFT',
  instrument: 'MUSIC_INSTRUMENT',
  dance: 'DANCE',
  fashion: 'FASHION_STYLING',
  interior: 'INTERIOR_DECOR',
  exercise: 'EXERCISE',
  walking: 'WALKING',
  climbing: 'CLIMBING',
  travel: 'TRAVEL',
  cafe: 'CAFE_HOPPING',
  pets: 'PET_TIME',
  'self-improvement': 'SELF_DEVELOPMENT',
  'job-prep': 'JOB_PREPARATION',
  exhibition: 'EXHIBITION',
  'art-museum': 'MUSEUM',
  volunteer: 'VOLUNTEER',
  'house-hunting': 'HOUSE_HUNTING',
};

const INTEREST_FROM_API = Object.fromEntries(
  Object.entries(INTEREST_TO_API).map(([key, value]) => [value, key])
) as Record<string, string>;

export const transformInterestToAPI = (interest: string): string => {
  if (!interest) return '';
  return INTEREST_TO_API[interest] || interest.toUpperCase().replace(/-/g, '_');
};

export const transformInterestFromAPI = (interest: string | null | undefined): string | null => {
  if (!interest) return null;
  return INTEREST_FROM_API[interest] ?? interest.toLowerCase().replace(/_/g, '-');
};

