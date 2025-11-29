'use client';

import React, { useState, useEffect } from 'react';
import { useNotificationSettings, useUpdateNotificationSettings } from '@/app/hooks/notification/useNotification';

const MyOption = () => {
  const [language, setLanguage] = useState<'한국어' | 'English'>('한국어');
  const [emailSubscription, setEmailSubscription] = useState(true);
  const [pushSubscription, setPushSubscription] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);

  // 알림 설정
  const { data: notificationSettings, isLoading: isLoadingSettings } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  const [allNotifications, setAllNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [likeNotifications, setLikeNotifications] = useState(true);

  // 알림 설정 초기화
  useEffect(() => {
    if (notificationSettings) {
      setAllNotifications(notificationSettings.allNotifications);
      setCommentNotifications(notificationSettings.commentNotifications);
      setLikeNotifications(notificationSettings.likeNotifications);
    }
  }, [notificationSettings]);

  // 알림 설정 업데이트
  const handleNotificationSettingChange = async (
    setting: 'allNotifications' | 'commentNotifications' | 'likeNotifications',
    value: boolean
  ) => {
    if (isLoadingSettings) return;

    const newSettings = {
      allNotifications: setting === 'allNotifications' ? value : allNotifications,
      commentNotifications: setting === 'commentNotifications' ? value : commentNotifications,
      likeNotifications: setting === 'likeNotifications' ? value : likeNotifications,
    };

    // allNotifications가 false면 다른 설정도 false로
    if (setting === 'allNotifications' && !value) {
      newSettings.commentNotifications = false;
      newSettings.likeNotifications = false;
    }

    try {
      await updateSettingsMutation.mutateAsync(newSettings);
      setAllNotifications(newSettings.allNotifications);
      setCommentNotifications(newSettings.commentNotifications);
      setLikeNotifications(newSettings.likeNotifications);
    } catch (error) {
      console.error('알림 설정 업데이트 실패:', error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-10">
      <header>
        <h2 className="hidden sm:block text-[28px] font-semibold text-grayScale-title">설정</h2>
      </header>

      <section className="flex w-full flex-col gap-4 sm:gap-5">
        <SettingCard>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <span className="text-sm sm:text-body1 text-grayScale-title">언어설정</span>
            <LanguageSegmentedControl value={language} onChange={setLanguage} />
          </div>
        </SettingCard>
        <h3 className="text-base sm:text-[20px] font-medium text-grayScale-title">기본 알림</h3>
        <SettingCard>
          <div className="mb-4">  
            <ToggleRow
              label="전체 알림"
              value={allNotifications}
              onChange={(value) => handleNotificationSettingChange('allNotifications', value)}
              disabled={isLoadingSettings}
            />
            <Divider />
            <ToggleRow
              label="댓글"
              value={commentNotifications}
              onChange={(value) => handleNotificationSettingChange('commentNotifications', value)}
              disabled={isLoadingSettings || !allNotifications}
            />
            <Divider />
            <ToggleRow
              label="공감"
              value={likeNotifications}
              onChange={(value) => handleNotificationSettingChange('likeNotifications', value)}
              disabled={isLoadingSettings || !allNotifications}
            />
          </div>
        </SettingCard>

        <h3 className="text-base sm:text-[20px] font-medium text-grayScale-title">부가설정</h3>
        <SettingCard>
          <div>
            <ToggleRow
              label="이메일 수신"
              value={emailSubscription}
              onChange={setEmailSubscription}
            />
            <Divider />
            <ToggleRow label="앱푸시" value={pushSubscription} onChange={setPushSubscription} />
            <Divider />
            <ToggleRow
              label="위치 정보 수집"
              value={locationSharing}
              onChange={setLocationSharing}
            />
          </div>
        </SettingCard>
      </section>
    </div>
  );
};

const SettingCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-[24px] bg-[#FAF8F7] px-4 sm:px-6 py-4 sm:py-5 shadow-[0_20px_60px_rgba(42,30,16,0.08)]">
    {children}
  </div>
);

const LanguageSegmentedControl = ({
  value,
  onChange,
}: {
  value: '한국어' | 'English';
  onChange: (value: '한국어' | 'English') => void;
}) => {
  const isEnglish = value === 'English';

  return (
    <div className="relative flex h-9 sm:h-10 w-full sm:w-[200px] items-center rounded-full bg-white p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]">
      <div
        className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-[#212121] transition-transform duration-300 ease-in-out ${
          isEnglish ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
        }`}
      />
      <button
        type="button"
        className={`relative z-[1] flex-1 rounded-full px-1 py-1 text-xs sm:text-sm transition-colors duration-200 ${
          isEnglish ? 'text-grayScale-500' : 'text-white'
        }`}
        onClick={() => onChange('한국어')}
      >
        한국어
      </button>
      <button
        type="button"
        className={`relative z-[1] flex-1 rounded-full py-1 text-xs sm:text-sm transition-colors duration-200 ${
          isEnglish ? 'text-white' : 'text-grayScale-500'
        }`}
        onClick={() => onChange('English')}
      >
        English
      </button>
    </div>
  );
};

const ToggleRow = ({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) => (
  <div className="flex items-center justify-between py-2">
    <span className={`text-sm sm:text-body1 ${disabled ? 'text-grayScale-400' : 'text-grayScale-title'}`}>{label}</span>
    <ToggleSwitch value={value} onChange={onChange} disabled={disabled} />
  </div>
);

const ToggleSwitch = ({
  value,
  onChange,
  disabled = false,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    aria-label={value ? '토글 끄기' : '토글 켜기'}
    onClick={() => !disabled && onChange(!value)}
    disabled={disabled}
    className={`relative h-6 w-12 rounded-full border border-transparent transition-colors duration-300 ease-in-out ${
      disabled
        ? 'bg-grayScale-200 cursor-not-allowed'
        : value
          ? 'bg-[var(--color-key-100)]'
          : 'bg-grayScale-300'
    }`}
  >
    <span
      className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${
        value ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const Divider = () => <span className="block h-[1px] w-full bg-white/80" aria-hidden="true" />;

export default MyOption;