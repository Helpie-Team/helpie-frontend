// About 페이지에서 사용할 이미지 경로들을 정의

// 이미지 경로 배열
export const aboutImagePaths = [
  '/images/about/cover.png',
  '/images/about/aboutCharacter.png',
  '/images/about/aboutCharacterGrid.png',
  '/images/about/community.png',
  '/images/about/life.png',
  '/images/about/life2.png',
  '/images/about/logoGrid.png',
  '/images/about/matching.png',
  '/images/about/seperate.png',
  '/images/about/simbol1.png',
  '/images/about/simbol2.png',
  '/images/about/simbol3.png',
  '/images/about/width1.png',
  '/images/about/width2.png',
  '/images/about/width3.png',
  '/images/about/width4.png',
  '/images/about/check_icon.png',
  '/images/about/helpieDes.png',
  '/images/about/draft.png',
  '/images/about.ourCharacter.png'
  
] as const;

// 이미지 이름과 경로를 매핑한 객체
export const aboutImageMap = {
  cover: '/images/about/cover.png',
  aboutCharacter: '/images/about/aboutCharacter.png',
  aboutCharacterGrid: '/images/about/aboutCharacterGrid.png',
  community: '/images/about/community.png',
  life: '/images/about/life.png',
  life2: '/images/about/life2.png',
  logoGrid: '/images/about/logoGrid.png',
  matching: '/images/about/matching.png',
  seperate: '/images/about/seperate.png',
  simbol1: '/images/about/simbol1.png',
  simbol2: '/images/about/simbol2.png',
  simbol3: '/images/about/simbol3.png',
  width1: '/images/about/width1.png',
  width2: '/images/about/width2.png',
  width3: '/images/about/width3.png',
  width4: '/images/about/width4.png',
  checkIcon: '/images/about/check_icon.png',
  hepie: '/images/about/helpieDes.png',
  draft: '/images/about/draft.png',
  character: '/images/about/ourCharacter.png'

} as const;

// 타입 정의
export type AboutImageKey = keyof typeof aboutImageMap;
export type AboutImagePath = typeof aboutImagePaths[number];

// 카테고리별 이미지 그룹 (필요에 따라 사용)
export const aboutImageCategories = {
  characters: [
    aboutImageMap.aboutCharacter,
    aboutImageMap.aboutCharacterGrid,
  ],
  features: [
    aboutImageMap.community,
    aboutImageMap.life,
    aboutImageMap.life2,
    aboutImageMap.matching,
  ],
  symbols: [
    aboutImageMap.simbol1,
    aboutImageMap.simbol2,
    aboutImageMap.simbol3,
  ],
  layout: [
    aboutImageMap.logoGrid,
    aboutImageMap.seperate,
    aboutImageMap.width1,
    aboutImageMap.width2,
    aboutImageMap.width3,
  ],
} as const;