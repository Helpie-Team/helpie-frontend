// 소모임 페이지 관련 타입 정의

// 관심사/카테고리
export type Interest =
  | 'MOVIE_WATCHING'
  | 'SPORTS'
  | 'MUSIC'
  | 'ART'
  | 'COOKING'
  | 'TRAVEL'
  | 'READING'
  | 'GAMING'
  | 'FITNESS'
  | 'PHOTOGRAPHY'
  | 'LANGUAGE'
  | 'STUDY'
  | 'VOLUNTEER'
  | 'OTHER';

// 소모임 상태
export type GroupStatus = 'RECRUITING' | 'RECRUITMENT_CLOSED' | 'COMPLETED';

// 소모임 카테고리 (백엔드 enum 값)
export type GroupCategory = 'ALL' | 'HOBBY' | 'ART' | 'STUDY' | 'LIFE' | 'SOCIAL';

// 소모임 생성 payload (JSON 부분)
export interface MatchingCreatePayload {
  title: string;
  description: string;
  maxMember: number;
  cityId: number; // 도시 ID (/api/v1/locations/cities에서 조회)
  category: string; // 소모임 카테고리
  interest: Interest[];
  meetingDate: string; // 실제 모임 날짜시간
}

// 소모임 생성 요청 (FormData에 담을 데이터)
export interface MatchingCreateRequest {
  payload: MatchingCreatePayload;
  images?: File[]; // 사진 파일 배열
}

// 소모임 생성/상세 응답 타입
export interface MatchingDetailResponse {
  id: number;
  title: string;
  description: string;
  maxMember: number;
  city: string;
  interest: Interest[];
  imageUrls: string[];
}

// 소모임 상세 정보 (GET /api/v1/group/{groupId})
export interface GroupDetail {
  id: number;
  title: string;
  description: string;
  cityName: string;
  category: GroupCategory;
  maxMember: number;
  thumbnail: string;
  isPopular: boolean;
  dayBefore: number;
  status: GroupStatus;
  meetingDate: string;
}

// 소모임 상세 정보 응답
export interface GroupDetailResponse {
  statusCode: number;
  message: string;
  result: GroupDetail;
}

// 소모임 리스트 아이템
export interface GroupListItem {
  id: number;
  title: string;
  description: string;
  cityName: string;
  category: GroupCategory;
  maxMember: number;
  thumbnail: string;
  isPopular: boolean;
  dayBefore: number;
  status: GroupStatus;
  meetingDate: string;
}

// Pageable 타입
export interface Pageable {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  unpaged: boolean;
}

// 소모임 리스트 조회 응답
export interface GroupListResponse {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  size: number;
  content: GroupListItem[];
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 소모임 리스트 조회 파라미터
export interface GroupListParams {
  country: string;
  category: GroupCategory;
  page?: number;
}

// 관심 소모임 등록/해제 응답
export type GroupMarkStatus = 'ADDED' | 'REMOVED';

export interface GroupMarkResponse {
  status: GroupMarkStatus;
}