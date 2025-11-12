import PartyIcon from '@/public/icons/party_icon.png';
import ClassIcon from '@/public/icons/class_icon.png';
import DocumentIcon from '@/public/icons/docs_icon.png';
import StudyIcon from '@/public/icons/study_icon.png';
import TravelIcon from '@/public/icons/travel_icon.png';
import PartyImage from '@/public/images/pary_image.png';
import TravelImage from '@/public/images/travel_image.png';
import ClassImage from '@/public/images/class_image.png';
import DocumentImage from '@/public/images/docs_image.png';
import StudyImage from '@/public/images/study_image.png';

export const CATEGORY_ITEMS = [
    {
      title: '파티 / 이벤트',
      description: '현지 친구를 사귀고 빠르게 적응할 수 있는 포틀럭, 아페르티보 등 소셜 이벤트✨',
      icon: PartyIcon,
      image: PartyImage,      
      
    },
    {
      title: '여행',
      description: '교환학생, 유학생, 이민자들이 함께 떠나는 도시·국가별 여행 동행 찾기✈️',
      icon: TravelIcon,
      image: TravelImage,
      
      
    },
    {
      title: '클래스',
      description: '요가, 요리 등 현지 문화를 배우며 즐겁게 적응하는 클래스 모임🌿',
      icon: ClassIcon,
      image: ClassImage,
      
      
    },
    {
      title: '서류 / 준비',
      description: '비자, 집 구하기 등 유학·이민 준비를 함께 하는 정보 공유 모임🗂️',
      icon: DocumentIcon,
      image: DocumentImage,
      
      
    },
    {
      title: '공부 / 자격증',
      description: '공부, 자격증 준비를 함께하며 서로 도우며 성장하는 스터디 모임📚',
      icon: StudyIcon,
      image: StudyImage,
      
      
    },
  ] as const;