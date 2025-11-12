/**
 * 성별을 사용자 친화적인 텍스트로 변환
 */
export const formatGender = (gender: string): string => {
  const genderMap: Record<string, string> = {
    MALE: '남',
    FEMALE: '여',
    OTHER: '기타',
  };
  return genderMap[gender] || gender;
};

/**
 * 나이대를 사용자 친화적인 텍스트로 변환
 */
export const formatAgeGroup = (ageGroup: string): string => {
  const ageGroupMap: Record<string, string> = {
    TEENS: '10대',
    TWENTIES: '20대',
    THIRTIES: '30대',
    FORTIES: '40대',
    OTHER: '기타',
  };
  return ageGroupMap[ageGroup] || ageGroup;
};

/**
 * 언어를 사용자 친화적인 텍스트로 변환
 */
export const formatLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    KOREAN: '한국어',
    ENGLISH: 'English',
    CHINESE: '中文語',
    JAPANESE: '日本語',
    SPANISH: 'Español',
    FRENCH: 'Français',
  };
  return languageMap[language] || language;
};

/**
 * 관심사를 사용자 친화적인 텍스트로 변환
 */
export const formatInterest = (interest: string): string => {
  const interestMap: Record<string, string> = {
    MOVIE_WATCHING: '영화 감상',
    MUSIC_LISTENING: '음악 듣기',
    DRAMA: '드라마',
    DIARY: '일기',
    OTT_VIEWING: 'OTT 시청',
    WRITING: '글쓰기',
    READING: '독서',
    BAKING: '베이킹',
    HEALTHY_COOKING: '건강식 요리',
    PHOTOGRAPHY: '사진 촬영',
    DIY_CRAFT: 'DIY 공예',
    MUSIC_INSTRUMENT: '악기 연주',
    DANCE: '춤/댄스',
    FASHION_STYLING: '패션 스타일링',
    INTERIOR_DECOR: '인테리어/꾸미기',
    EXERCISE: '운동',
    WALKING: '산책',
    CLIMBING: '클라이밍',
    TRAVEL: '여행',
    CAFE_HOPPING: '카페 탐방',
    PET_TIME: '반려동물과 시간 보내기',
    SELF_DEVELOPMENT: '자기계발',
    JOB_PREPARATION: '취업준비',
    EXHIBITION: '전시회',
    MUSEUM: '미술관 관람',
    VOLUNTEER: '봉사활동',
    HOUSE_HUNTING: '집구하기',
  };
  return interestMap[interest] || interest;
};

