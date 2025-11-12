'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import { useMyGroupInfo } from '@/app/hooks/my-page/useMyGroupInfo';
import { useMyBookmarkInfo } from '@/app/hooks/my-page/useMyBookmarkInfo';
import { MyBookmarkItem, MyGroupInfoItem } from '@/app/api/types/my-page/group';
import PlaceholderGroupImage from '@/public/images/helpie-chat-bot.png';

const TABS = [
  { id: 'UPCOMING', label: '모임예정' },
  { id: 'PAST', label: '지난모임' },
  { id: 'BOOKMARK', label: '관심' },
] as const;

type TabType = (typeof TABS)[number]['id'];

type GroupVariant = 'upcoming' | 'past';

type EmptyStateVariant = 'upcoming' | 'past' | 'bookmark';

const generateGroupKey = (prefix: string, group: MyGroupInfoItem, index: number) => {
  const uniqueSource = group.id ?? `${group.meetingDate ?? ''}-${group.title ?? ''}`.trim();
  return `${prefix}-${uniqueSource || 'fallback'}-${index}`;
};

const generateBookmarkKey = (bookmark: MyBookmarkItem, index: number) => {
  const uniqueSource = bookmark.id ?? `${bookmark.title ?? ''}-${bookmark.city ?? ''}`.trim();
  return `bookmark-${uniqueSource || 'fallback'}-${index}`;
};

const MyMatching = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');

  const upcomingQuery = useMyGroupInfo({ status: 'RECRUITING', size: 4, enabled: activeTab === 'UPCOMING' });
  const pastQuery = useMyGroupInfo({ status: 'COMPLETED', size: 4, enabled: activeTab === 'PAST' });
  const bookmarkQuery = useMyBookmarkInfo({ size: 8, enabled: activeTab === 'BOOKMARK' });

  const upcomingGroups = useMemo(
    () => upcomingQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [upcomingQuery.data],
  );
  const pastGroups = useMemo(
    () => pastQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [pastQuery.data],
  );
  const bookmarkedGroups = useMemo(
    () => bookmarkQuery.data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [bookmarkQuery.data],
  );

  const renderContent = () => {
    if (activeTab === 'UPCOMING') {
      return (
        <TabSection
          isLoading={upcomingQuery.isLoading}
          hasError={!!upcomingQuery.error}
          errorMessage={upcomingQuery.error instanceof Error ? upcomingQuery.error.message : undefined}
          isEmpty={!upcomingQuery.isLoading && upcomingGroups.length === 0}
          emptyVariant="upcoming"
          onEmptyAction={() => router.push('/matching')}
          emptyActionLabel="소모임 둘러보기"
          onLoadMore={upcomingQuery.hasNextPage ? () => upcomingQuery.fetchNextPage() : undefined}
          isLoadingMore={upcomingQuery.isFetchingNextPage}
        >
          <div className="flex flex-col gap-4">
            {upcomingGroups.map((group, index) => (
              <GroupCard
                key={generateGroupKey('upcoming', group, index)}
                group={group}
                variant="upcoming"
              />
            ))}
          </div>
        </TabSection>
      );
    }

    if (activeTab === 'PAST') {
      return (
        <TabSection
          isLoading={pastQuery.isLoading}
          hasError={!!pastQuery.error}
          errorMessage={pastQuery.error instanceof Error ? pastQuery.error.message : undefined}
          isEmpty={!pastQuery.isLoading && pastGroups.length === 0}
          emptyVariant="past"
          onLoadMore={pastQuery.hasNextPage ? () => pastQuery.fetchNextPage() : undefined}
          isLoadingMore={pastQuery.isFetchingNextPage}
        >
          <div className="flex flex-col gap-4">
            {pastGroups.map((group, index) => (
              <GroupCard
                key={generateGroupKey('past', group, index)}
                group={group}
                variant="past"
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {bookmarkedGroups.map((item, index) => (
            <BookmarkCard
              key={generateBookmarkKey(item, index)}
              bookmark={item}
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
    upcoming: {
      title: '아직 참여한 소모임이 없어요',
      description: '지금 새로운 모임을 찾아보세요!',
    },
    past: {
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

const GroupCard = ({ group, variant }: { group: MyGroupInfoItem; variant: GroupVariant }) => {
  const isPast = variant === 'past';
  const meetingDate = formatDate(group.meetingDate);
  const headLabel = isPast ? '모임완료' : '참여 중인 모임';
  const rightLabel = isPast
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
              <span>{locationText}</span>
              <SeparatorDot />
              <span className="flex items-center gap-1">
                <span aria-hidden="true">👥</span>
                {memberText}
              </span>
              <SeparatorDot />
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

          {isPast ? (
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
              className="flex-1 rounded-full bg-grayScale-100 py-2 text-body2 text-grayScale-title transition hover:bg-grayScale-200"
            >
              신청취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BookmarkCard = ({ bookmark }: { bookmark: MyBookmarkItem }) => {
  const meetingDDay = typeof bookmark.dday === 'number' ? bookmark.dday : undefined;
  const ddayLabel = meetingDDay !== undefined ? `D-${meetingDDay}` : undefined;

  return (
    <div className="flex flex-col gap-3 rounded-[24px] bg-white p-4 shadow-[0_12px_40px_rgba(42,30,16,0.08)]">
      <div className="relative h-[140px] w-full overflow-hidden rounded-[20px] bg-grayScale-200">
        <Image
          src={bookmark.thumbnailUrl ?? PlaceholderGroupImage}
          alt={bookmark.title || 'bookmark-thumbnail'}
          fill
          sizes="200px"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex gap-2 text-caption1-regular text-white">
          {ddayLabel && <span className="rounded-full bg-gray-900 px-2 py-1">{ddayLabel}</span>}
          {bookmark.tags?.[0] && (
            <span className="rounded-full bg-[var(--color-key-100)] px-2 py-1">{bookmark.tags[0]}</span>
          )}
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-lg text-[var(--color-key-100)]"
        >
          ♥
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-caption1-regular text-grayScale-500">
          {bookmark.city ?? '지역 정보 없음'} · {bookmark.category ?? '소모임'}
        </p>
        <p className="text-body1 text-grayScale-title">{bookmark.title ?? '소모임 제목을 입력하세요'}</p>
        <p className="text-body2 text-grayScale-500">
          {bookmark.summary ?? '썸네일 소모임 설명은 두 줄까지 표시됩니다.'}
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