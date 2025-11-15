'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { cancelGroupApplication, toggleGroupBookmark } from '@/app/api/my-page/group';
import { MY_GROUP_INFO_QUERY_KEY, useMyGroupInfo } from '@/app/hooks/my-page/useMyGroupInfo';
import { MY_BOOKMARK_INFO_QUERY_KEY, useMyBookmarkInfo } from '@/app/hooks/my-page/useMyBookmarkInfo';
import { MyBookmarkItem, MyGroupInfoItem, PaginatedResponse } from '@/app/api/types/my-page/group';
import PlaceholderGroupImage from "@/public/images/noImage.png";
import heart from '@/public/icons/heart.png';
import noHeart from '@/public/icons/noHeart.png';
import noImage from '@/public/images/noImage.png';
import { MapPin, Tag, Users } from 'lucide-react';

const TABS = [
  { id: 'UPCOMING', label: '모임예정' },
  { id: 'PAST', label: '지난모임' },
  { id: 'BOOKMARK', label: '관심' },
] as const;

type TabType = (typeof TABS)[number]['id'];

type GroupVariant = 'UPCOMING' | 'PAST';

type EmptyStateVariant = 'UPCOMING' | 'PAST' | 'bookmark';

const getGroupIdentifier = (group: MyGroupInfoItem) => group.id ?? group.groupId;

const generateGroupKey = (prefix: string, group: MyGroupInfoItem, index: number) => {
  const identifier = getGroupIdentifier(group);
  const uniqueSource = identifier ?? `${group.meetingDate ?? ''}-${group.title ?? ''}`.trim();
  return `${prefix}-${uniqueSource || 'fallback'}-${index}`;
};

const generateBookmarkKey = (bookmark: MyBookmarkItem, index: number) => {
  const uniqueSource = bookmark.id ?? `${bookmark.title ?? ''}-${bookmark.city ?? ''}`.trim();
  return `bookmark-${uniqueSource || 'fallback'}-${index}`;
};

const MyMatching = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');
  const queryClient = useQueryClient();
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);
  const [bookmarkTargetId, setBookmarkTargetId] = useState<number | null>(null);
  const [bookmarkStates, setBookmarkStates] = useState<Record<number, boolean>>({});

  const cancelMutation = useMutation({
    mutationFn: cancelGroupApplication,
    onMutate: (groupId: number) => {
      setCancelTargetId(groupId);
    },
    onSuccess: (_, groupId) => {
      if (typeof groupId === 'number') {
        queryClient.setQueriesData<InfiniteData<PaginatedResponse<MyGroupInfoItem>>>(
          { queryKey: MY_GROUP_INFO_QUERY_KEY },
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                content: page.content.filter((item) => getGroupIdentifier(item) !== groupId),
              })),
            };
          },
        );
      }

      queryClient.invalidateQueries({ queryKey: MY_GROUP_INFO_QUERY_KEY });
    },
    onError: (error) => {
      console.error('소모임 신청 취소에 실패했습니다.', error);
    },
    onSettled: () => {
      setCancelTargetId(null);
    },
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: toggleGroupBookmark,
    onMutate: (groupId: number) => {
      setBookmarkTargetId(groupId);
    },
    onSuccess: (data, groupId) => {
      if (typeof groupId === 'number') {
        setBookmarkStates((prev) => ({
          ...prev,
          [groupId]: data.status === 'ADDED',
        }));

        if (data.status === 'REMOVED') {
          queryClient.setQueriesData<InfiniteData<PaginatedResponse<MyBookmarkItem>>>(
            { queryKey: MY_BOOKMARK_INFO_QUERY_KEY },
            (old) => {
              if (!old) return old;
              return {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  content: page.content.filter((item) => item.id !== groupId),
                })),
              };
            },
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: MY_BOOKMARK_INFO_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_GROUP_INFO_QUERY_KEY });
    },
    onError: (error) => {
      console.error('관심 소모임 업데이트에 실패했습니다.', error);
    },
    onSettled: () => {
      setBookmarkTargetId(null);
    },
  });

  const UPCOMINGQuery = useMyGroupInfo({ status: 'UPCOMING', size: 4, enabled: activeTab === 'UPCOMING' });
  const PASTQuery = useMyGroupInfo({ status: 'PAST', size: 4, enabled: activeTab === 'PAST' });
  const bookmarkQuery = useMyBookmarkInfo({ size: 8, enabled: activeTab === 'BOOKMARK' });

  const UPCOMINGGroups = useMemo(
    () => UPCOMINGQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [UPCOMINGQuery.data],
  );
  const PASTGroups = useMemo(
    () => PASTQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [PASTQuery.data],
  );
  const bookmarkedGroups = useMemo(
    () => bookmarkQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [bookmarkQuery.data],
  );

  useEffect(() => {
    if (bookmarkedGroups.length === 0) {
      setBookmarkStates({});
      return;
    }

    setBookmarkStates((prev) => {
      const next: Record<number, boolean> = {};

      bookmarkedGroups.forEach((item) => {
        next[item.id] = prev[item.id] ?? item.liked ?? true;
      });

      return next;
    });
  }, [bookmarkedGroups]);

  const handleCancelGroup = (group: MyGroupInfoItem) => {
    const targetId = getGroupIdentifier(group);
    if (!targetId) {
      console.error('소모임 식별자를 찾을 수 없습니다.', group);
      return;
    }

    if (cancelMutation.isPending) {
      return;
    }
    cancelMutation.mutate(targetId);
  };

  const handleToggleBookmark = (groupId: number) => {
    if (toggleBookmarkMutation.isPending) {
      return;
    }
    toggleBookmarkMutation.mutate(groupId);
  };

  const renderContent = () => {
    if (activeTab === 'UPCOMING') {
      return (
        <TabSection
          isLoading={UPCOMINGQuery.isLoading}
          hasError={!!UPCOMINGQuery.error}
          errorMessage={UPCOMINGQuery.error instanceof Error ? UPCOMINGQuery.error.message : undefined}
          isEmpty={!UPCOMINGQuery.isLoading && UPCOMINGGroups.length === 0}
          emptyVariant="UPCOMING"
          onEmptyAction={() => router.push('/matching')}
          emptyActionLabel="소모임 둘러보기"
          onLoadMore={UPCOMINGQuery.hasNextPage ? () => UPCOMINGQuery.fetchNextPage() : undefined}
          isLoadingMore={UPCOMINGQuery.isFetchingNextPage}
        >
          <div className="flex flex-col gap-4">
            {UPCOMINGGroups.map((group, index) => (
              <GroupCard
                key={generateGroupKey('UPCOMING', group, index)}
                group={group}
                variant="UPCOMING"
                onCancel={() => handleCancelGroup(group)}
                isCancelling={cancelTargetId === getGroupIdentifier(group) && cancelMutation.isPending}
              />
            ))}
          </div>
        </TabSection>
      );
    }

    if (activeTab === 'PAST') {
      return (
        <TabSection
          isLoading={PASTQuery.isLoading}
          hasError={!!PASTQuery.error}
          errorMessage={PASTQuery.error instanceof Error ? PASTQuery.error.message : undefined}
          isEmpty={!PASTQuery.isLoading && PASTGroups.length === 0}
          emptyVariant="PAST"
          onLoadMore={PASTQuery.hasNextPage ? () => PASTQuery.fetchNextPage() : undefined}
          isLoadingMore={PASTQuery.isFetchingNextPage}
        >
          <div className="flex flex-col gap-4">
            {PASTGroups.map((group, index) => (
              <GroupCard
                key={generateGroupKey('PAST', group, index)}
                group={group}
                variant="PAST"
              />
            ))}
          </div>
        </TabSection>
      );
    }

    return (
      <TabSection
        isLoading={bookmarkQuery.isLoading}
        hasError={!!bookmarkQuery.error}
        errorMessage={bookmarkQuery.error instanceof Error ? bookmarkQuery.error.message : undefined}
        isEmpty={!bookmarkQuery.isLoading && bookmarkedGroups.length === 0}
        emptyVariant="bookmark"
        onEmptyAction={() => router.push('/matching')}
        emptyActionLabel="소모임 둘러보기"
        onLoadMore={bookmarkQuery.hasNextPage ? () => bookmarkQuery.fetchNextPage() : undefined}
        isLoadingMore={bookmarkQuery.isFetchingNextPage}
      >
        <div className="flex flex-row flex-wrap gap-4">
          {bookmarkedGroups.map((item, index) => (
            <BookmarkCard
              key={generateBookmarkKey(item, index)}
              bookmark={item}
              onToggleBookmark={() => handleToggleBookmark(item.id)}
              isToggling={bookmarkTargetId === item.id && toggleBookmarkMutation.isPending}
              isLiked={bookmarkStates[item.id] ?? item.liked ?? true}
            />
          ))}
        </div>
      </TabSection>
    );
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <header>
        <h2 className="text-[28px] font-semibold text-grayScale-title">나의 소모임</h2>
      </header>

      <nav className="border-b border-grayScale-100">
        <div className="relative mx-auto flex max-w-[720px] justify-between text-center text-body1 text-grayScale-500">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full px-2 pb-3 transition-colors duration-200 ${
                activeTab === tab.id ? 'text-[var(--color-key-100)]' : 'hover:text-grayScale-title'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <TabIndicator activeTab={activeTab} tabCount={TABS.length} />
        </div>
      </nav>

      {renderContent()}
    </div>
  );
};

const TabSection = ({
  isLoading,
  hasError,
  errorMessage,
  isEmpty,
  emptyVariant,
  onEmptyAction,
  emptyActionLabel,
  onLoadMore,
  isLoadingMore,
  children,
}: {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  isEmpty: boolean;
  emptyVariant: EmptyStateVariant;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  children: React.ReactNode;
}) => {
  if (isLoading) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10">
        <p className="text-body1 text-grayScale-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="rounded-[24px] bg-[#FBF7F4] p-10 text-center">
        <p className="text-body1 text-grayScale-600">소모임 정보를 불러오지 못했습니다.</p>
        {errorMessage && <p className="mt-2 text-body2 text-grayScale-400">{errorMessage}</p>}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        variant={emptyVariant}
        onAction={onEmptyAction}
        actionLabel={emptyActionLabel}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {children}
      {onLoadMore && (
        <button
          type="button"
          onClick={onLoadMore}
          className="mx-auto mt-2 w-full max-w-[360px] rounded-full bg-grayScale-100 py-3 text-body1 text-grayScale-title transition hover:bg-grayScale-200"
          disabled={isLoadingMore}
        >
          {isLoadingMore ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
};

const EmptyState = ({
  variant,
  onAction,
  actionLabel,
}: {
  variant: EmptyStateVariant;
  onAction?: () => void;
  actionLabel?: string;
}) => {
  const messages: Record<EmptyStateVariant, { title: string; description: string }> = {
    UPCOMING: {
      title: '아직 참여한 소모임이 없어요',
      description: '지금 새로운 모임을 찾아보세요!',
    },
    PAST: {
      title: '아직 참여한 소모임이 없어요',
      description: '첫 소모임에 참여하고, 나만의 기록을 만들어보세요.',
    },
    bookmark: {
      title: '찜한 소모임이 없어요',
      description: '마음에 드는 소모임에 하트를 눌러 저장해보세요 🤎',
    },
  };

  const { title, description } = messages[variant];

  return (
    <div className="rounded-[24px] bg-[#FBF7F4] p-16 text-center">
      <div className="mx-auto flex max-w-[360px] flex-col items-center gap-6">
        <div className="space-y-3">
          <p className="text-h3 text-grayScale-title">{title}</p>
          <p className="text-body2 text-grayScale-500">{description}</p>
        </div>
        {onAction && actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="w-full rounded-full bg-[var(--color-key-100)] py-3 text-body1 text-white transition hover:opacity-90"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

const GroupCard = ({
  group,
  variant,
  onCancel,
  isCancelling = false,
}: {
  group: MyGroupInfoItem;
  variant: GroupVariant;
  onCancel?: () => void;
  isCancelling?: boolean;
}) => {
  const actionGroupId = getGroupIdentifier(group);
  const isPAST = variant === 'PAST';
  const meetingDate = formatDate(group.meetingDate);
  const headLabel = isPAST ? '모임완료' : '참여 중인 모임';
  const rightLabel = isPAST
    ? meetingDate ?? '모임 일정 미확인'
    : meetingDate ?? (group.meetingType === 'OFFLINE' ? '오프라인 모임 일시' : '모임 일정 준비 중');

  const memberText = `${group.currentMemberCount ?? 0}/${group.totalMemberCount ?? 0}`;
  const categoryText = group.category ?? '카테고리';
  const locationText = group.city ?? '지역 정보 없음';

  const handleChatClick = () => {
    if (group.chatUrl) {
      window.open(group.chatUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="rounded-[24px] bg-white px-6 py-5 shadow-[0_12px_40px_rgba(42,30,16,0.08)]">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between text-caption1-regular text-grayScale-500">
          <span>{headLabel}</span>
          <span>{rightLabel}</span>
        </div>

        <div className="flex gap-4">
          <div className="relative h-[92px] w-[92px] overflow-hidden rounded-[20px] bg-grayScale-200">
            <Image
              src={group.thumbnailUrl ?? PlaceholderGroupImage}
              alt={group.title || 'group-thumbnail'}
              fill
              sizes="92px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div>
              <p className="text-body1 text-grayScale-title">{group.title ?? '이름'}</p>
              <p className="text-body2 text-grayScale-500">{group.summary ?? '본문'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-caption1-regular text-grayScale-500">
            <MapPin className="w-4 h-4" />
              <span>{locationText}</span>
              <SeparatorDot />
              <span className="flex items-center gap-1">
                <span aria-hidden="true"></span>
                <Users className="w-4 h-4" />
                {memberText}
              </span>
              <SeparatorDot />
              <Tag className="w-4 h-4" />
              <span>{categoryText}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleChatClick}
            className="flex-1 rounded-full border border-grayScale-300 py-2 text-body2 text-grayScale-title transition hover:bg-grayScale-100"
            disabled={!group.chatUrl}
          >
            채팅방 이동
          </button>

          {isPAST ? (
            <button
              type="button"
              className={`flex-1 rounded-full py-2 text-body2 transition ${
                group.reviewWritten
                  ? 'border border-grayScale-300 text-grayScale-title hover:bg-grayScale-100'
                  : 'bg-[var(--color-key-100)] text-white hover:opacity-90'
              }`}
            >
              {group.reviewWritten ? '작성한 후기 보기' : '후기 작성하기'}
            </button>
          ) : (
            <button
              type="button"
              className="flex-1 rounded-full bg-grayScale-100 py-2 text-body2 text-grayScale-title transition hover:bg-grayScale-200 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={onCancel}
              disabled={!onCancel || isCancelling || !actionGroupId}
            >
              {isCancelling ? '취소 중...' : '신청취소'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BookmarkCard = ({
  bookmark,
  onToggleBookmark,
  isToggling,
  isLiked,
}: {
  bookmark: MyBookmarkItem;
  onToggleBookmark: () => void;
  isToggling: boolean;
  isLiked: boolean;
}) => {
  const router = useRouter();
  const meetingDDay = typeof bookmark.dday === 'number' ? bookmark.dday : undefined;

  // 카테고리 색상 매핑
  const categoryColors: Record<string, string> = {
    'HOBBY': 'bg-[#7BAF6E]',
    'ART': 'bg-[#F5A623]',
    'LIFE': 'bg-[#9B6FCC]',
    'STUDY': 'bg-[#E94B3C]',
    'SOCIAL': 'bg-[#4A90E2]',
  };

  // 카테고리 한글 표시
  const categoryDisplayNames: Record<string, string> = {
    'HOBBY': '문화·취미',
    'ART': '예술·창작',
    'LIFE': '액티비티·라이프',
    'STUDY': '자기계발·성장',
    'SOCIAL': '사회·교류',
  };

  const categoryColor = bookmark.category ? categoryColors[bookmark.category] : 'bg-grayScale-500';
  const categoryDisplay = bookmark.category ? categoryDisplayNames[bookmark.category] : '소모임';

  return (
    <div
      className="w-[180px] rounded-2xl flex flex-col cursor-pointer"
      onClick={() => router.push(`/matching?groupId=${bookmark.id}`)}
    >
      <div className="relative w-[180px] h-[130px] overflow-hidden rounded-2xl">
        <Image
          src={bookmark.thumbnailUrl && typeof bookmark.thumbnailUrl === 'string' && bookmark.thumbnailUrl.trim() !== '' ? bookmark.thumbnailUrl : noImage}
          alt={bookmark.title || 'bookmark-thumbnail'}
          fill
          sizes="180px"
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = noImage.src;
          }}
        />
        {/* D-day 배지 */}
        {meetingDDay !== undefined && (
          <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-caption1 font-semibold">
            D-{meetingDDay}
          </div>
        )}

        {/* 하트 버튼 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          className="absolute bottom-1 right-2 w-[32px] h-[32px] z-10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          disabled={isToggling}
          aria-label={isLiked ? '관심 소모임 해제' : '관심 소모임 등록'}
        >
          <Image
            src={isLiked ? heart : noHeart}
            alt="찜하기"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-1 px-2 mt-2">
        <div className="flex items-center gap-2 text-caption1-regular text-grayScale-500">
          {/* 카테고리 배지 */}
          <div className={`${categoryColor} text-white px-2 py-1 rounded-full text-caption1-b whitespace-nowrap flex-shrink-0`}>
            {categoryDisplay}
          </div>
          <span className="whitespace-nowrap">{bookmark.city ?? '지역'}</span>
        </div>
        <h3 className="text-body2 text-black line-clamp-1 break-words">{bookmark.title ?? '소모임 제목'}</h3>
        <p className="text-body3-regular text-grayScale-600 line-clamp-2 break-words">
          {bookmark.summary ?? '설명'}
        </p>
      </div>
    </div>
  );
};

const SeparatorDot = () => <span className="text-grayScale-300" aria-hidden="true">·</span>;

const formatDate = (date?: string | null) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toISOString().split('T')[0];
};

export default MyMatching;

const TabIndicator = ({ activeTab, tabCount }: { activeTab: TabType; tabCount: number }) => {
  const index = TABS.findIndex((tab) => tab.id === activeTab);

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
