export interface MyGroupInfoArray {
  content: MyGroupInfoItem[];
}

export interface MyBookmarkArray {
  content: MyBookmarkItem[];
}
export interface MyGroupInfoItem {
  groupId?: number;
  title: string;
  description?: string;
  cityName?: string;
  category?: string;
  currentMember?: number;
  maxMember?: number;
  meetingDate?: string;
  thumbnailUrl?: string | null;
}
export type PageData<T> = PaginatedResponse & { content: T[] };

export interface MyBookmarkItem {
  id: number;
  title: string;
  description?: string;
  maxMembers:number;
  isPopular:boolean;
  cityName?: string;
  category?: string;
  meetingDate: string;
  createdAt: string;
  dDay?: number;
  thumbnailUrl?: string | null;
}

export type BookmarkToggleStatus = 'ADDED' | 'REMOVED';

export interface BookmarkToggleResponse {
  status: BookmarkToggleStatus;
}

export interface PaginatedResponse {
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}