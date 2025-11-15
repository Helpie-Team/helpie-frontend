export type GroupCategory =
  | 'CULTURAL' | 'SPORTS' | 'SOCIAL' | 'STUDY' | 'ETC'; // 필요에 맞게 추가/수정

export type GroupStatus = 'RECRUITING' | 'RECRUITMENT_CLOSED' | 'COMPLETED';

export interface GroupSummary {
  id: number;
  title: string;
  description: string;
  cityName: string;     // "대한민국 > 서울"
  category: GroupCategory;
  maxMember: number;
  thumbnail: string;
  isPopular: boolean;
  dayBefore: number;
  status: GroupStatus;
  meetingDate: string;  // ISO string
}

export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface Pageable {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort;
  unpaged: boolean;
}

// 스프링 페이지 공통 형태
export interface Page<T> {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  size: number;
  content: T[];
  number: number; // 현재 페이지
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}