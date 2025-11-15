/**
 * 관심사 카테고리 데이터
 */

export interface InterestTag {
  id: string;
  label: string;
}

export interface InterestCategory {
  title: string;
  interests: InterestTag[];
}

/**
 * 관심사 카테고리 목록을 반환하는 함수
 */
export function getInterestCategories(): InterestCategory[] {
  return [
    {
      title: '문화·취미',
      interests: [
        { id: 'movie', label: '영화 감상' },
        { id: 'music', label: '음악 듣기' },
        { id: 'drama', label: '드라마' },
        { id: 'diary', label: '일기' },
        { id: 'ott', label: 'OTT 시청' },
        { id: 'writing', label: '글쓰기' },
        { id: 'reading', label: '독서' },
      ],
    },
    {
      title: '예술·클래스',
      interests: [
        { id: 'baking', label: '베이킹' },
        { id: 'cooking', label: '건강식 요리' },
        { id: 'photography', label: '사진 촬영' },
        { id: 'diy', label: 'DIY 공예' },
        { id: 'instrument', label: '악기 연주' },
        { id: 'dance', label: '춤/댄스' },
        { id: 'fashion', label: '패션 스타일링' },
        { id: 'interior', label: '인테리어/꾸미기' },
      ],
    },
    {
      title: '액티비티·라이프',
      interests: [
        { id: 'exercise', label: '운동' },
        { id: 'walking', label: '산책' },
        { id: 'climbing', label: '클라이밍' },
        { id: 'travel', label: '여행' },
        { id: 'cafe', label: '카페 탐방' },
        { id: 'pets', label: '반려동물과 시간 보내기' },
      ],
    },
    {
      title: '자기계발·공부',
      interests: [
        { id: 'self-improvement', label: '자기계발' },
        { id: 'job-prep', label: '취업준비' },
      ],
    },
    {
      title: '사회·친목',
      interests: [
        { id: 'exhibition', label: '전시회' },
        { id: 'art-museum', label: '미술관 관람' },
        { id: 'volunteer', label: '봉사활동' },
        { id: 'house-hunting', label: '집구하기' },
      ],
    },
  ];
}

