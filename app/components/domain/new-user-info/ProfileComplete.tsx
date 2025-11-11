'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBasicInfo } from '@/app/api/survey/survey';
import { BasicInfoResponseData } from '@/app/api/types/survey/survey';
import CompleteCheckIcon from '@/public/icons/complete_check_icon.svg';
import Image from 'next/image';
import { ProfileInfoRow } from './ProfileInfoRow';
import { formatGender, formatAgeGroup, formatLanguage, formatInterest } from '@/app/lib/utils/profileFormatters';

export default function ProfileComplete() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<BasicInfoResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGoToProfile = () => {
    router.push('/my-page');
  };

  const handleBrowseGroups = () => {
    router.push('/matching');
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await getBasicInfo();
        setProfileData(data);
      } catch (err) {
        console.error('프로필 정보 조회 실패:', err);
        setError('프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-body1 text-grayScale-700">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-body1 text-grayScale-700">{error || '프로필 정보를 불러올 수 없습니다.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-white flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        {/* Success Checkmark Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-full border-2 border-[var(--color-grayScale-100)] bg-[var(--color-key-300)] flex items-center justify-center">
            <Image src={CompleteCheckIcon} alt="checkmark" width={27} height={26} />
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-3">
          <h1 className="font-pretendard font-semibold text-[24px] leading-[100%] tracking-[0%] text-[var(--color-grayScale-title)]">
            프로필 작성이 완료되었습니다.
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-12">
          <p className="text-body1 text-grayScale-700">
            지금 바로 당신을 위한 맞춤형 소모임을 확인하세요!
          </p>
        </div>

        {/* Profile Summary Box */}
        <div className="bg-[#FAF8F7] rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            {/* 거주도시 */}
            <ProfileInfoRow label="거주도시">
              <div className="flex items-center gap-1">
                <span className="text-body2 text-grayScale-700">{profileData.cityName}</span>
              </div>
            </ProfileInfoRow>

            {/* 성별 나이 */}
            <ProfileInfoRow label="성별 · 나이">
              <span className="text-body2 text-grayScale-700 font-medium">
                {formatGender(profileData.gender)} · {formatAgeGroup(profileData.ageGroup)}
              </span>
            </ProfileInfoRow>

            {/* 사용 언어 */}
            <ProfileInfoRow label="사용 언어">
              <span className="text-body2 text-grayScale-700 font-medium">
                {profileData.languages.map(formatLanguage).join(' · ')}
              </span>
            </ProfileInfoRow>

            {/* 관심사 */}
            <ProfileInfoRow label="관심사" align="start">
              <div className="flex flex-wrap gap-2 justify-end max-w-[70%]">
                {profileData.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-block px-3 py-1.5 rounded-full bg-white border border-grayScale-300 text-body3 text-grayScale-700 font-medium"
                  >
                    {formatInterest(interest)}
                  </span>
                ))}
              </div>
            </ProfileInfoRow>
          </div>
        </div>

        {/* Instructional Text */}
        <div className="text-center mb-8">
          <p className="text-body3 text-grayScale-500">
            프로필 변경은 마이페이지 &gt; 나의 프로필에서 변경할 수 있습니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-[15rem]">
          <button
            onClick={handleGoToProfile}
            className="flex-1 py-3 rounded-3xl text-body1-sb border-1 border-grayScale-300 bg-white text-grayScale-700 hover:bg-grayScale-100 transition-all"
          >
            나의 프로필로 이동
          </button>
          <button
            onClick={handleBrowseGroups}
            className="flex-1 py-3 rounded-3xl text-body1-sb bg-[var(--color-key-100)] text-white hover:opacity-90 transition-all"
          >
            소모임 둘러보기
          </button>
        </div>
      </div>
    </div>
  );
}

