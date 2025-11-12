'use client';

import React, { useState } from 'react';

const MyOption = () => {
  const [language, setLanguage] = useState<'한국어' | 'English'>('한국어');
  const [emailSubscription, setEmailSubscription] = useState(true);
  const [pushSubscription, setPushSubscription] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);

  return (
    <div className="flex w-full flex-col gap-10">
      <header>
        <h2 className="text-[28px] font-semibold text-grayScale-title">나의 설정</h2>
      </header>

      <section className="flex w-full flex-col gap-5">
        <SettingCard>
          <div className="flex items-center justify-between">
            <span className="text-body1 text-grayScale-title">언어설정</span>
            <LanguageSegmentedControl value={language} onChange={setLanguage} />
          </div>
        </SettingCard>

        <SettingCard>
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
        </SettingCard>
      </section>
    </div>
  );
};

const SettingCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-[24px] bg-[#FBF7F4] px-6 py-5 shadow-[0_20px_60px_rgba(42,30,16,0.08)]">
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
    <div className="relative flex h-10 w-[200px] items-center rounded-full bg-white p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]">
      <div
        className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-[#212121] transition-transform duration-300 ease-in-out ${
          isEnglish ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
        }`}
      />
      <button
        type="button"
        className={`relative z-[1] flex-1 rounded-full px-1 py-1 text-sm transition-colors duration-200 ${
          isEnglish ? 'text-grayScale-500' : 'text-white'
        }`}
        onClick={() => onChange('한국어')}
      >
        한국어
      </button>
      <button
        type="button"
        className={`relative z-[1] flex-1 rounded-full py-1 text-sm transition-colors duration-200 ${
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
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-body1 text-grayScale-title">{label}</span>
    <ToggleSwitch value={value} onChange={onChange} />
  </div>
);

const ToggleSwitch = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <button
    type="button"
    aria-label={value ? '토글 끄기' : '토글 켜기'}
    onClick={() => onChange(!value)}
    className={`relative h-6 w-12 rounded-full border border-transparent transition-colors duration-300 ease-in-out ${
      value ? 'bg-[var(--color-key-100)]' : 'bg-grayScale-300'
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