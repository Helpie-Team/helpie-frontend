/**
 * 설문조사 데이터를 API 요청 형식으로 변환하는 유틸리티 함수들
 */

/**
 * 성별을 API enum으로 변환
 */
export const transformGenderToAPI = (gender: string): 'MALE' | 'FEMALE' | 'OTHER' => {
  const genderMap: Record<string, 'MALE' | 'FEMALE' | 'OTHER'> = {
    male: 'MALE',
    female: 'FEMALE',
    other: 'OTHER',
  };
  return genderMap[gender] || 'OTHER';
};

/**
 * 나이대를 API enum으로 변환
 */
export const transformAgeGroupToAPI = (ageRange: string): 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'OTHER' => {
  const ageGroupMap: Record<string, 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'OTHER'> = {
    '10s': 'TEENS',
    '20s': 'TWENTIES',
    '30s': 'THIRTIES',
    '40s': 'FORTIES',
    other: 'OTHER',
  };
  return ageGroupMap[ageRange] || 'OTHER';
};

/**
 * 언어를 API enum으로 변환
 */
export const transformLanguageToAPI = (language: string): string => {
  const languageMap: Record<string, string> = {
    korean: 'KOREAN',
    english: 'ENGLISH',
    chinese: 'CHINESE',
    japanese: 'JAPANESE',
    spanish: 'SPANISH',
    french: 'FRENCH',
  };
  return languageMap[language] || language.toUpperCase();
};

/**
 * 관심사를 API enum으로 변환
 */
export const transformInterestToAPI = (interest: string): string => {
  const interestMap: Record<string, string> = {
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
  return interestMap[interest] || interest.toUpperCase().replace(/-/g, '_');
};

