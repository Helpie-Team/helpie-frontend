export interface MyGroupInfoItem {
  id: number;
  title: string;
  summary?: string;
  thumbnailUrl?: string | null;
  city?: string;
  category?: string;
  meetingDate?: string | null;
  meetingType?: string | null;
  status?: string | null;
  currentMemberCount?: number;
  totalMemberCount?: number;
  dday?: number;
  chatUrl?: string | null;
  reviewWritten?: boolean;
  tags?: string[];
}

export interface MyBookmarkItem {
  id: number;
  title: string;
  summary?: string;
  thumbnailUrl?: string | null;
  city?: string;
  category?: string;
  dday?: number;
  tags?: string[];
  liked?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}
