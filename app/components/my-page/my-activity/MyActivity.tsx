'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { MoreVertical, Heart } from 'lucide-react';

import {
  ActivityMainTab,
  ActivitySubTab,
  MyReviewItem,
  MyCommentItem,
  MyPostItem,
  MyGroupPostItem,
} from '@/app/api/types/my-page/activity';
import {
  useMyReviews,
  useMyComments,
  useMyCommunityPosts,
  useMyGroupPosts,
} from '@/app/hooks/my-page/useMyActivity';
import PlaceholderGroupImage from '@/public/images/noImage.png';
import { MapPin, Tag, Users } from 'lucide-react';

const MAIN_TABS = [
  { id: 'LIKES' as const, label: '공감' },
  { id: 'COMMENTS' as const, label: '댓글' },
  { id: 'POSTS' as const, label: '내 게시글' },
] as const;

const LIKES_SUB_TABS = [{ id: 'REVIEW' as const, label: '리뷰' }] as const;

const POSTS_SUB_TABS = [
  { id: 'GROUP' as const, label: '소모임' },
  { id: 'REVIEW' as const, label: '리뷰' },
  { id: 'COMMUNITY' as const, label: '커뮤니티' },
] as const;

const MyActivity = () => {
  const [activeMainTab, setActiveMainTab] = useState<ActivityMainTab>('LIKES');
  const [activeSubTab, setActiveSubTab] = useState<ActivitySubTab>('REVIEW');

  // API 호출
  const reviewsQuery = useMyReviews({
    enabled: activeMainTab === 'LIKES' && activeSubTab === 'REVIEW',
  });
  const commentsQuery = useMyComments({
    enabled: activeMainTab === 'COMMENTS',
  });
  const communityPostsQuery = useMyCommunityPosts({
    enabled: activeMainTab === 'POSTS' && activeSubTab === 'COMMUNITY',
  });
  const groupPostsQuery = useMyGroupPosts({
    enabled: activeMainTab === 'POSTS' && activeSubTab === 'GROUP',
  });

  // 데이터 추출
  const reviews = useMemo(
    () => reviewsQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [reviewsQuery.data]
  );
  const comments = useMemo(
    () => commentsQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [commentsQuery.data]
  );
  const communityPosts = useMemo(
    () => communityPostsQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [communityPostsQuery.data]
  );
  const groupPosts = useMemo(
    () => groupPostsQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [groupPostsQuery.data]
  );

  // 통계 계산
  const stats = useMemo(
    () => ({
      likesCount: reviews.length,
      commentsCount: comments.length,
      postsCount: communityPosts.length + groupPosts.length,
    }),
    [reviews.length, comments.length, communityPosts.length, groupPosts.length]
  );

  const getTabLabel = (tabId: ActivityMainTab): string => {
    const tab = MAIN_TABS.find((t) => t.id === tabId);
    if (!tab) return '';
    const count = stats[`${tabId.toLowerCase()}Count` as keyof typeof stats] as number;
    return `${tab.label} ${count}`;
  };

  const renderContent = () => {
    if (activeMainTab === 'LIKES') {
      return <LikesTabContent reviewsQuery={reviewsQuery} reviews={reviews} />;
    }
    if (activeMainTab === 'COMMENTS') {
      return <CommentsTabContent commentsQuery={commentsQuery} comments={comments} />;
    }
    return (
      <PostsTabContent
        activeSubTab={activeSubTab}
        communityPostsQuery={communityPostsQuery}
        groupPostsQuery={groupPostsQuery}
        communityPosts={communityPosts}
        groupPosts={groupPosts}
      />
    );
  };

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <header>
        <h2 className="hidden sm:block text-[28px] font-semibold text-grayScale-title">나의 활동</h2>
      </header>

      <nav className="border-b border-grayScale-100">
        <div className="relative mx-auto flex max-w-[720px] justify-between text-center text-sm sm:text-body1 text-grayScale-500">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMainTab(tab.id)}
              className={`w-full px-2 pb-3 transition-colors duration-200 ${
                activeMainTab === tab.id ? 'text-[var(--color-key-100)]' : 'hover:text-grayScale-title'
              }`}
            >
              {getTabLabel(tab.id)}
            </button>
          ))}
          <TabIndicator activeTab={activeMainTab} tabCount={MAIN_TABS.length} />
        </div>
      </nav>

      {activeMainTab === 'LIKES' && (
        <div className="flex gap-2">
          {LIKES_SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-body2 transition-colors ${
                activeSubTab === tab.id
                   ? 'bg-black text-white'
                  : 'bg-white text-black border-grayScale-100 border-[1px] hover:bg-grayScale-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {activeMainTab === 'POSTS' && (
        <div className="flex gap-2">
          {POSTS_SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-body2 transition-colors ${
                activeSubTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-grayScale-100 border-[1px] hover:bg-grayScale-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {renderContent()}
    </div>
  );
};

// 공감 탭 콘텐츠 (리뷰만 표시)
const LikesTabContent = ({
  reviewsQuery,
  reviews,
}: {
  reviewsQuery: ReturnType<typeof useMyReviews>;
  reviews: MyReviewItem[];
}) => {
  return <LikedReviewsList reviewsQuery={reviewsQuery} reviews={reviews} />;
};

// 공감한 리뷰 리스트 (내가 작성한 리뷰)
const LikedReviewsList = ({
  reviewsQuery,
  reviews,
}: {
  reviewsQuery: ReturnType<typeof useMyReviews>;
  reviews: MyReviewItem[];
}) => {
  if (reviewsQuery.isLoading) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10">
        <p className="text-body1 text-grayScale-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (reviewsQuery.error) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10 text-center">
        <p className="text-body1 text-grayScale-600">리뷰 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        title="아직 작성한 리뷰가 없어요"
        description="소모임 후기를 작성해보세요"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <LikedReviewCard key={review.id} review={review} />
      ))}
      {reviewsQuery.hasNextPage && (
        <button
          type="button"
          onClick={() => reviewsQuery.fetchNextPage()}
          disabled={reviewsQuery.isFetchingNextPage}
          className="mx-auto mt-2 w-full max-w-[360px] rounded-full bg-grayScale-100 py-3 text-body1 text-grayScale-title transition hover:bg-grayScale-200 disabled:opacity-70"
        >
          {reviewsQuery.isFetchingNextPage ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
};

// 공감한 리뷰 카드
const LikedReviewCard = ({ review }: { review: MyReviewItem }) => {
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} 참여`;
  };

  const formattedMeetingDate = formatDate(review.meetingDate);

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="relative h-[70px] w-[70px] sm:h-[92px] sm:w-[92px] overflow-hidden rounded-[20px] bg-grayScale-200 flex-shrink-0">
        <Image
          src={review.thumbnailUrl ?? PlaceholderGroupImage}
          alt={review.groupTitle}
          fill
          sizes="92px"
          className="object-cover"
        />
        <div className="absolute bottom-1 right-1">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-red-500 text-red-500" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 sm:gap-2 min-w-0">
        <h3 className="text-sm sm:text-body1 text-grayScale-title truncate">{review.groupTitle}</h3>
        <div className="flex gap-0.5 sm:gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-sm sm:text-lg ${star <= review.rating ? 'text-[var(--color-key-100)]' : 'text-grayScale-200'}`}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-xs sm:text-caption1-regular text-grayScale-500 truncate">
          {review.reviewerName} {formattedMeetingDate}
        </p>
        <p className="text-xs sm:text-body2 text-grayScale-600 line-clamp-2">{review.contentPreview}</p>
      </div>
    </div>
  );
};


// 댓글 탭 콘텐츠
const CommentsTabContent = ({
  commentsQuery,
  comments,
}: {
  commentsQuery: ReturnType<typeof useMyComments>;
  comments: MyCommentItem[];
}) => {
  if (commentsQuery.isLoading) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10">
        <p className="text-body1 text-grayScale-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (commentsQuery.error) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10 text-center">
        <p className="text-body1 text-grayScale-600">댓글 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <EmptyState
        title="작성한 댓글이 없습니다"
        description="관심 있는 게시글에 댓글을 남겨 이야기를 나눠보세요"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      {commentsQuery.hasNextPage && (
        <button
          type="button"
          onClick={() => commentsQuery.fetchNextPage()}
          disabled={commentsQuery.isFetchingNextPage}
          className="mx-auto mt-2 w-full max-w-[360px] rounded-full bg-grayScale-100 py-3 text-body1 text-grayScale-title transition hover:bg-grayScale-200 disabled:opacity-70"
        >
          {commentsQuery.isFetchingNextPage ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
};

// 댓글 카드
const CommentCard = ({ comment }: { comment: MyCommentItem }) => {
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formattedDate = formatDate(comment.createdAt);

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="relative h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] overflow-hidden rounded-full bg-grayScale-200 flex-shrink-0">
        <Image
          src={comment.thumbnailUrl ?? PlaceholderGroupImage}
          alt="프로필"
          fill
          sizes="50px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 sm:gap-2 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-caption1-regular text-grayScale-500 flex-wrap">
          <span>{comment.categoryDisplayName}</span>
          <span className="text-grayScale-title truncate">{comment.title}</span>
          <span>에 남긴 댓글</span>
        </div>
        <p className="text-xs sm:text-body2 text-grayScale-600 line-clamp-2">{comment.contentPreview}</p>
        <p className="text-xs sm:text-caption1-regular text-grayScale-400">{formattedDate}</p>
      </div>
    </div>
  );
};

// 내 게시글 탭 콘텐츠
const PostsTabContent = ({
  activeSubTab,
  communityPostsQuery,
  groupPostsQuery,
  communityPosts,
  groupPosts,
}: {
  activeSubTab: ActivitySubTab;
  communityPostsQuery: ReturnType<typeof useMyCommunityPosts>;
  groupPostsQuery: ReturnType<typeof useMyGroupPosts>;
  communityPosts: MyPostItem[];
  groupPosts: MyGroupPostItem[];
}) => {
  if (activeSubTab === 'COMMUNITY') {
    return (
      <CommunityPostsList
        communityPostsQuery={communityPostsQuery}
        communityPosts={communityPosts}
      />
    );
  }
  if (activeSubTab === 'GROUP') {
    return <GroupPostsList groupPostsQuery={groupPostsQuery} groupPosts={groupPosts} />;
  }
  // REVIEW 탭은 추후 구현
  return (
    <EmptyState
      title="아직 작성한 리뷰가 없어요"
      description="소모임 후기를 작성해보세요"
    />
  );
};

// 커뮤니티 게시글 리스트
const CommunityPostsList = ({
  communityPostsQuery,
  communityPosts,
}: {
  communityPostsQuery: ReturnType<typeof useMyCommunityPosts>;
  communityPosts: MyPostItem[];
}) => {
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-menu-container]')) {
        setExpandedMenuId(null);
      }
    };

    if (expandedMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [expandedMenuId]);

  if (communityPostsQuery.isLoading) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10">
        <p className="text-body1 text-grayScale-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (communityPostsQuery.error) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10 text-center">
        <p className="text-body1 text-grayScale-600">게시글 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  if (communityPosts.length === 0) {
    return (
      <EmptyState
        title="아직 작성한 게시글이 없어요"
        description="당신의 경험이 누군가에게 도움이 될 거예요 🌱"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {communityPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isMenuOpen={expandedMenuId === post.id}
          onMenuToggle={() => setExpandedMenuId(expandedMenuId === post.id ? null : post.id)}
        />
      ))}
      {communityPostsQuery.hasNextPage && (
        <button
          type="button"
          onClick={() => communityPostsQuery.fetchNextPage()}
          disabled={communityPostsQuery.isFetchingNextPage}
          className="mx-auto mt-2 w-full max-w-[360px] rounded-full bg-grayScale-100 py-3 text-body1 text-grayScale-title transition hover:bg-grayScale-200 disabled:opacity-70"
        >
          {communityPostsQuery.isFetchingNextPage ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
};

// 소모임 게시글 리스트
const GroupPostsList = ({
  groupPostsQuery,
  groupPosts,
}: {
  groupPostsQuery: ReturnType<typeof useMyGroupPosts>;
  groupPosts: MyGroupPostItem[];
}) => {
  if (groupPostsQuery.isLoading) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10">
        <p className="text-body1 text-grayScale-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (groupPostsQuery.error) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10 text-center">
        <p className="text-body1 text-grayScale-600">소모임 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  if (groupPosts.length === 0) {
    return (
      <EmptyState
        title="아직 작성한 소모임이 없어요"
        description="새로운 소모임을 만들어보세요"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groupPosts.map((group) => (
        <GroupPostCard key={group.groupId} group={group} />
      ))}
      {groupPostsQuery.hasNextPage && (
        <button
          type="button"
          onClick={() => groupPostsQuery.fetchNextPage()}
          disabled={groupPostsQuery.isFetchingNextPage}
          className="mx-auto mt-2 w-full max-w-[360px] rounded-full bg-grayScale-100 py-3 text-body1 text-grayScale-title transition hover:bg-grayScale-200 disabled:opacity-70"
        >
          {groupPostsQuery.isFetchingNextPage ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
};

// 소모임 게시글 카드
const GroupPostCard = ({ group }: { group: MyGroupPostItem }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const formattedDate = formatDate(group.meetingDate);
  const memberText = `${group.currentMember}/${group.maxMember}`;

  return (
    <div className="rounded-[24px] bg-white px-4 sm:px-6 py-4 sm:py-5 shadow-[0_12px_40px_rgba(42,30,16,0.08)]">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex gap-3 sm:gap-4">
          <div className="relative h-[80px] w-[80px] sm:h-[92px] sm:w-[92px] overflow-hidden rounded-[20px] bg-grayScale-200 flex-shrink-0">
            <Image
              src={group.thumbnailUrl ?? PlaceholderGroupImage}
              alt={group.title}
              fill
              sizes="92px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2 min-w-0">
            <div>
              <p className="text-sm sm:text-body1 text-grayScale-title truncate">{group.title}</p>
              <p className="text-xs sm:text-body2 text-grayScale-500 line-clamp-2">{group.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-caption1-regular text-grayScale-500">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{group.cityName}</span>
              <SeparatorDot />
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                {memberText}
              </span>
              <SeparatorDot />
              <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{group.category}</span>
            </div>
            <p className="text-xs sm:text-caption1-regular text-grayScale-500">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SeparatorDot = () => <span className="text-grayScale-300" aria-hidden="true">·</span>;

// 게시글 카드
const PostCard = ({
  post,
  isMenuOpen,
  onMenuToggle,
}: {
  post: MyPostItem;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}) => {
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formattedDate = formatDate(post.createdAt);

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="relative h-[70px] w-[70px] sm:h-[92px] sm:w-[92px] overflow-hidden rounded-[20px] bg-grayScale-200 flex-shrink-0">
        <Image
          src={post.thumbnailUrl ?? PlaceholderGroupImage}
          alt={post.title}
          fill
          sizes="92px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 sm:gap-2 relative min-w-0" data-menu-container>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 flex-col gap-1 min-w-0">
            <p className="text-xs sm:text-caption1-regular text-grayScale-500">{post.categoryDisplayName}</p>
            <h3 className="text-sm sm:text-body1 text-grayScale-title truncate">{post.title}</h3>
            <p className="text-xs sm:text-body2 text-grayScale-500 line-clamp-2">{post.contentPreview}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle();
            }}
            className="ml-2 p-1 hover:bg-grayScale-100 rounded transition-colors flex-shrink-0"
            title="메뉴 열기"
            aria-label="메뉴 열기"
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-grayScale-400" />
          </button>
        </div>
        <p className="text-xs sm:text-caption1-regular text-grayScale-400">{formattedDate}</p>

        {isMenuOpen && (
          <div className="absolute top-8 right-0 bg-white border border-grayScale-200 rounded-lg shadow-lg z-10 min-w-[120px]">
            <button
              type="button"
              onClick={() => {
                // 등록/수정 기능은 추후 구현 예정
                onMenuToggle();
              }}
              className="w-full px-4 py-2 text-left text-body2 text-grayScale-700 hover:bg-grayScale-50 flex items-center gap-2"
              disabled
            >
              <span>✏️</span>
              <span>수정</span>
            </button>
            <button
              type="button"
              onClick={() => {
                // 등록/수정 기능은 추후 구현 예정
                onMenuToggle();
              }}
              className="w-full px-4 py-2 text-left text-body2 text-grayScale-700 hover:bg-grayScale-50 flex items-center gap-2"
              disabled
            >
              <span>🗑️</span>
              <span>삭제</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 빈 상태 컴포넌트
const EmptyState = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="rounded-[24px] bg-[#FBF7F4] p-16 text-center">
      <div className="mx-auto flex max-w-[360px] flex-col items-center gap-6">
        <div className="space-y-3">
          <p className="text-h3 text-grayScale-title">{title}</p>
          <p className="text-body2 text-grayScale-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

// 탭 인디케이터
const TabIndicator = ({ activeTab, tabCount }: { activeTab: ActivityMainTab; tabCount: number }) => {
  const index = MAIN_TABS.findIndex((tab) => tab.id === activeTab);

  const widthClass = tabCount === 3 ? 'w-1/3' : 'w-full';
  const translateClasses = ['translate-x-0', 'translate-x-[100%]', 'translate-x-[200%]'];
  const translateClass = translateClasses[index] ?? 'translate-x-0';

  return (
    <span
      className={`pointer-events-none absolute bottom-0 h-[3px] transform rounded-full bg-[var(--color-key-100)] transition-transform duration-300 ease-in-out ${widthClass} ${translateClass}`}
      aria-hidden="true"
    />
  );
};

export default MyActivity;
