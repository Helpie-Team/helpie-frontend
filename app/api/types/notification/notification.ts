export type NotificationType = 'COMMENT' | 'LIKE' | 'REVIEW' | string;

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  relatedId: number;
  relatedType: string;
  actorId: number;
  actorName: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationListResponse {
  totalPages: number;
  totalElements: number;
  pageable: {
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
  };
  size: number;
  content: Notification[];
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

export interface NotificationPageable {
  page?: number;
  size?: number;
  sort?: string[];
}

// API가 숫자를 직접 반환하거나 객체를 반환할 수 있음
export interface UnreadCountResponse {
  count?: number;
}

export interface NotificationSettings {
  allNotifications: boolean;
  commentNotifications: boolean;
  likeNotifications: boolean;
}

