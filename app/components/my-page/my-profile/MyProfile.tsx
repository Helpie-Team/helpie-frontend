'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useMyProfileInfo, MY_PROFILE_INFO_QUERY_KEY } from '@/app/hooks/my-page/useMyProfileInfo';
import {
  formatAgeGroup,
  formatGender,
  formatInterest,
  formatLanguage,
} from '@/app/lib/utils/profileFormatters';
import ProfileIconImage from '@/public/images/profile_icon.png';

import { ProfileInfoRow } from '../../domain/new-user-info/ProfileInfoRow';
import { logout } from '@/app/api/auth/auth';
import { clearTokens, getRefreshToken } from '@/app/lib/utils/token';
import { useUsernameValidation } from '@/app/hooks/auth/useUsernameValidation';
import { resetProfileImage, updateProfileUsername, uploadProfileImage } from '@/app/api/my-page/profile';
import { useStepStore } from '@/app/lib/stores/stepStore';
import { getBasicInfo } from '@/app/api/survey/survey';
import { useCityStore } from '@/app/lib/stores/cityStore';
import { useGenderStore } from '@/app/lib/stores/genderStore';
import { useAgeStore } from '@/app/lib/stores/ageStore';
import { Language, useLanguageStore } from '@/app/lib/stores/languageStore';
import { useInterestStore } from '@/app/lib/stores/interestStore';
import {
  transformAgeGroupFromAPI,
  transformGenderFromAPI,
  transformInterestFromAPI,
  transformLanguageFromAPI,
} from '@/app/lib/utils/surveyTransformers';
import ArrowIcon from '@/public/icons/arrow_icon.svg';
import Link from 'next/link';

const MyProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [nicknameHelperText, setNicknameHelperText] = useState('2자 ~ 12자 이내로 설정해주세요.');

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyProfileInfo();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const currentUsername = profile?.username ?? '';

  const { validateUsername, isChecking: isCheckingNickname } = useUsernameValidation(300);

  const updateNicknameMutation = useMutation({
    mutationFn: (nickname: string) => updateProfileUsername(nickname),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MY_PROFILE_INFO_QUERY_KEY });
      router.refresh();
      setIsNicknameModalOpen(false);
      setNewNickname('');
      setNicknameStatus('idle');
      setNicknameHelperText('2자 ~ 12자 이내로 설정해주세요.');
    },
  });

  useEffect(() => {
    if (!isNicknameModalOpen || !currentUsername) return;

    const trimmed = newNickname.trim();

    if (!trimmed) {
      setNicknameStatus('idle');
      setNicknameHelperText('2자 ~ 12자 이내로 설정해주세요.');
      return;
    }

    if (trimmed.length < 2 || trimmed.length > 12) {
      setNicknameStatus('invalid');
      setNicknameHelperText('2자 ~ 12자 이내로 설정해주세요.');
      return;
    }

    if (trimmed === currentUsername) {
      setNicknameStatus('invalid');
      setNicknameHelperText('현재 사용 중인 별명과 동일합니다.');
      return;
    }

    let active = true;
    validateUsername(trimmed).then(({ isValid, errorMessage }) => {
      if (!active) return;
      if (isValid) {
        setNicknameStatus('valid');
        setNicknameHelperText('2자 ~ 12자 이내로 설정해주세요.');
      } else {
        setNicknameStatus('invalid');
        setNicknameHelperText(errorMessage ?? '이미 사용중인 별명입니다.');
      }
    });

    return () => {
      active = false;
    };
  }, [currentUsername, isNicknameModalOpen, newNickname, validateUsername]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadProfileImageMutation = useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MY_PROFILE_INFO_QUERY_KEY });
      router.refresh();
    },
  });

  const resetProfileImageMutation = useMutation({
    mutationFn: () => resetProfileImage(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MY_PROFILE_INFO_QUERY_KEY });
      router.refresh();
    },
  });

  const handleAvatarClick = () => {
    if (uploadProfileImageMutation.isPending || resetProfileImageMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const handleAvatarReset = async () => {
    if (!profile?.imageUrl || resetProfileImageMutation.isPending || uploadProfileImageMutation.isPending) {
      return;
    }

    const confirmed = window.confirm('프로필 이미지를 초기화하시겠습니까?');
    if (!confirmed) return;

    try {
      await resetProfileImageMutation.mutateAsync();
    } catch (err) {
      console.error('프로필 이미지 초기화 실패:', err);
    }
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (uploadProfileImageMutation.isPending || resetProfileImageMutation.isPending) return;

    try {
      await uploadProfileImageMutation.mutateAsync(file);
    } catch (err) {
      console.error('프로필 이미지 업로드 실패:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-20">
        <div className="flex w-full max-w-[720px] flex-col gap-6">
          <div className="h-6 w-32 animate-pulse rounded bg-grayScale-200" />
          <div className="flex flex-col items-center gap-6">
            <div className="h-[120px] w-[120px] animate-pulse rounded-full bg-grayScale-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-grayScale-200" />
            <div className="h-4 w-56 animate-pulse rounded bg-grayScale-200" />
            <div className="h-40 w-full animate-pulse rounded-[24px] bg-grayScale-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex w-full flex-col items-center gap-3 py-20 text-center">
        <p className="text-body1 text-grayScale-600">
          프로필 정보를 불러오는 중 오류가 발생했습니다.
        </p>
        {error instanceof Error && (
          <p className="text-body2 text-grayScale-400">{error.message}</p>
        )}
      </div>
    );
  }

  const shouldShowCallout = !profile.surveyStatus || !profile.surveyBasicInfo;

  const { email, imageUrl, surveyBasicInfo } = profile;

  const displayCity = surveyBasicInfo?.cityName ??
    (profile?.city ? `${profile.city.country.name} > ${profile.city.name}` : '미등록');
  const displayGender = surveyBasicInfo?.gender ? formatGender(surveyBasicInfo.gender) : '미등록';
  const displayAgeGroup = surveyBasicInfo?.ageGroup ? formatAgeGroup(surveyBasicInfo.ageGroup) : '미등록';
  const displayLanguages = surveyBasicInfo?.languages?.length
    ? surveyBasicInfo.languages.map(formatLanguage).join(' · ')
    : '미등록';
  const displayInterests = surveyBasicInfo?.interests?.map(formatInterest) ?? [];

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    if (isLoggingOut) return;
    setIsLogoutModalOpen(false);
  };

  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logout(refreshToken);
      } else {
        clearTokens();
      }
    } catch (err) {
      console.error('로그아웃 실패:', err);
      clearTokens();
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
      router.replace('/');
      router.refresh();
       
    }
   };
 
  const handleOpenNicknameModal = () => {
    setNewNickname('');
    setNicknameStatus('idle');
    setNicknameHelperText('2자 ~ 12자 이내로 설정해주세요.');
    setIsNicknameModalOpen(true);
  };
 
  const handleCloseNicknameModal = () => {
    if (updateNicknameMutation.isPending) return;
    setIsNicknameModalOpen(false);
    setNewNickname('');
    setNicknameStatus('idle');
    setNicknameHelperText('2자 ~ 12자 이내로 설정해주세요.');
  };
 
  const handleNicknameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nicknameStatus !== 'valid' || isCheckingNickname || updateNicknameMutation.isPending) {
      return;
    }
 
    const trimmed = newNickname.trim();
    if (!trimmed) return;
 
    try {
      await updateNicknameMutation.mutateAsync(trimmed);
    } catch (err) {
      let message = '별명 변경에 실패했습니다.';
      if (err instanceof AxiosError) {
        message = err.response?.data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setNicknameStatus('invalid');
      setNicknameHelperText(message);
    }
  };
 
  const handleEditSurveyBasicInfo = async () => {
    const stepStore = useStepStore.getState();
    const cityStore = useCityStore.getState();
    const genderStore = useGenderStore.getState();
    const ageStore = useAgeStore.getState();
    const languageStore = useLanguageStore.getState();
    const interestStore = useInterestStore.getState();

    stepStore.reset();

    try {
      const basicInfo = await getBasicInfo();

      if (basicInfo) {
        stepStore.setProfileData(basicInfo);
        stepStore.setHasBasicInfo(true);

        if (profile.city) {
          cityStore.setSelectedCity({
            id: profile.city.id,
            name: profile.city.name,
            englishName: profile.city.englishName,
            country: profile.city.country.name,
            countryCode: profile.city.country.code,
            fullPath: `${profile.city.country.name} > ${profile.city.name}`,
          });
        } else {
          cityStore.setSelectedCity({
            id: basicInfo.cityId,
            name: basicInfo.cityName,
            englishName: basicInfo.cityName,
            country: '',
            countryCode: '',
            fullPath: basicInfo.cityName,
          });
        }

        genderStore.setSelectedGender(transformGenderFromAPI(basicInfo.gender));
        ageStore.setSelectedAgeRange(transformAgeGroupFromAPI(basicInfo.ageGroup));

        const transformedLanguages = (basicInfo.languages ?? [])
          .map(transformLanguageFromAPI)
          .filter((language): language is Language => Boolean(language));
        languageStore.setLanguages(transformedLanguages);

        const transformedInterests = (basicInfo.interests ?? [])
          .map(transformInterestFromAPI)
          .filter((interest): interest is string => Boolean(interest));
        interestStore.setInterests(transformedInterests);
      }
    } catch (error) {
      console.error('설문조사 기본 정보 조회 실패:', error);
      stepStore.setHasBasicInfo(false);
      cityStore.clearCity();
      genderStore.clearGender();
      ageStore.clearAgeRange();
      languageStore.clearLanguages();
      interestStore.clearInterests();
    } finally {
      router.push('/new-user-info');
    }
  };

   return (
     <div className="flex w-full flex-col items-center gap-14">
       <div className="flex w-full max-w-[720px] flex-col items-center gap-10">
         <h2 className="self-start text-[28px] font-semibold text-grayScale-title">나의 프로필</h2>
 
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFileChange}
          aria-label="프로필 이미지 파일 선택"
        />
        <ProfileAvatar
          name={currentUsername}
          email={email}
          imageUrl={imageUrl}
          onUploadClick={handleAvatarClick}
          onResetClick={handleAvatarReset}
          isMutating={uploadProfileImageMutation.isPending || resetProfileImageMutation.isPending}
        />
 
         <div className="flex w-full flex-col gap-4">
           <ProfileSummaryCard
            nickname={currentUsername}
            email={email}
            onEditNickname={handleOpenNicknameModal}
          />

          {shouldShowCallout ? (
            <ProfileCallout />
          ) : (
            <ProfileDetailCard
              city={displayCity}
              gender={displayGender}
              ageGroup={displayAgeGroup}
              languages={displayLanguages}
              interests={displayInterests}
              onEditSurveyBasicInfo={handleEditSurveyBasicInfo}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full">
        <button
          type="button"
          className="text-body1 text-grayScale-600 transition hover:text-grayScale-title"
          onClick={handleLogoutClick}
        >
          로그아웃
        </button>

       <p className="w-full h-[0.1px] bg-grayScale-300"/>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-body2 text-grayScale-500">더 이상 헬피 서비스를 이용을 원하지 않으시나요?</p>
          <button
            type="button"
            className="text-body2 text-grayScale-400 transition hover:text-grayScale-600"
            onClick={handleWithdrawClick}
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {isLogoutModalOpen && (
        <LogoutConfirmModal
          onCancel={handleCloseLogoutModal}
          onConfirm={handleConfirmLogout}
          isLoading={isLoggingOut}
        />
      )}

      {isWithdrawModalOpen && (
        <WithdrawInfoModal onClose={handleCloseWithdrawModal} />
      )}

      {isNicknameModalOpen && (
        <NicknameEditModal
          currentNickname={currentUsername}
          newNickname={newNickname}
          onChangeNickname={setNewNickname}
          helperText={nicknameHelperText}
          status={nicknameStatus}
          isChecking={isCheckingNickname}
          isSubmitting={updateNicknameMutation.isPending}
          onClose={handleCloseNicknameModal}
          onSubmit={handleNicknameSubmit}
        />
      )}
    </div>
  );
};

const ProfileAvatar = ({
  name,
  email,
  imageUrl,
  onUploadClick,
  onResetClick,
  isMutating,
}: {
  name: string;
  email: string;
  imageUrl: string | null;
  onUploadClick: () => void;
  onResetClick: () => void;
  isMutating: boolean;
}) => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative flex h-[120px] w-[120px] items-center justify-center">
      <button
        type="button"
        onClick={onUploadClick}
        className="relative flex h-full w-full items-center justify-center rounded-full bg-grayScale-100 transition hover:opacity-90 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-[var(--color-key-100)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isMutating}
        aria-label="프로필 이미지 변경"
      >
        <div className="relative h-full w-full overflow-hidden rounded-full">
          {imageUrl ? (
            <Image src={imageUrl} alt="profile-avatar" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Image src={ProfileIconImage} alt="default-profile" width={60} height={60} />
            </div>
          )}
        </div>
        {!imageUrl && (
          <span className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-key-100)] text-[18px] font-semibold leading-none text-white shadow-[0_8px_20px_rgba(255,77,0,0.35)]">
            {isMutating ? '…' : '+'}
          </span>
        )}
      </button>
      {imageUrl && (
        <button
          type="button"
          onClick={onResetClick}
          className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[16px] font-semibold leading-none text-grayScale-title shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition hover:bg-grayScale-100 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isMutating}
          aria-label="프로필 이미지 초기화"
        >
          {isMutating ? '…' : '×'}
        </button>
      )}
    </div>

    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-body1 text-grayScale-title">{name}</p>
      <p className="text-body2 text-grayScale-500">{email}</p>
    </div>
  </div>
);

const ProfileSummaryCard = ({
  nickname,
  email,
  onEditNickname,
}: {
  nickname: string;
  email: string;
  onEditNickname: () => void;
}) => (
  <div className="flex w-full flex-col gap-4 rounded-[24px] bg-[#FAF8F7] p-6 shadow-[0_20px_60px_rgba(42,30,16,0.08)]">
    <SummaryRow label="별명" value={nickname} showEdit onEdit={onEditNickname} />
    <SummaryRow label="이메일" value={email} />
  </div>
);

const SummaryRow = ({
  label,
  value,
  showEdit = false,
  onEdit,
}: {
  label: string;
  value: string;
  showEdit?: boolean;
  onEdit?: () => void;
}) => (
  <div className='flex flex-row justify-between items-center'>
    <div className="flex flex-row gap-2">
    <ProfileInfoRow label={`${label}`}>
      <span className="text-body1 text-grayScale-title">{value}</span>
      </ProfileInfoRow>
      </div>
    {showEdit && (
      <button
        type="button"
        className="h-9 rounded-full border border-grayScale-300 px-4 text-body2 text-grayScale-500 transition hover:border-[var(--color-key-100)] hover:text-[var(--color-key-100)]"
        onClick={onEdit}
      >
        변경
      </button>
    )}
  
  </div>
);

const ProfileDetailCard = ({
  city,
  gender,
  ageGroup,
  languages,
  interests,
  onEditSurveyBasicInfo,
}: {
  city: string;
  gender: string;
  ageGroup: string;
  languages: string;
  interests: string[];
  onEditSurveyBasicInfo: () => void;
}) => (
  <div className="flex flex-col  gap-4 rounded-[24px] bg-[#FAF8F7] p-6 shadow-[0_20px_60px_rgba(42,30,16,0.08)]">
    <div className='flex flex-row justify-between items-center'>
      <div className="flex flex-row gap-2">
      <ProfileInfoRow label="거주도시">
        <span className="text-body1 text-grayScale-title">{city}</span>
        </ProfileInfoRow>
      </div>
      <button
        type="button"
        className="h-9 rounded-full border border-grayScale-300 px-4 text-body2 text-grayScale-500 transition hover:border-[var(--color-key-100)] hover:text-[var(--color-key-100)]"
        onClick={onEditSurveyBasicInfo}
      >
        변경
      </button>
    </div>

    
      <ProfileInfoRow label="성별 · 나이">
            <span className="text-body2 text-grayScale-700">{gender} · {ageGroup}</span>
      </ProfileInfoRow>
      <ProfileInfoRow label="사용 언어">
        <span className="text-body2 text-grayScale-700">{languages}</span>
      </ProfileInfoRow>
      <ProfileInfoRow label="관심사" align="start">
        <div className="flex flex-wrap justify-end gap-2">
          {interests.length > 0 ? (
            interests.map((interest) => (
              <span
                key={interest}
                className="inline-block rounded-full bg-white px-3 py-1.5 text-body3 text-grayScale-700 border-1 border-grayScale-200"
              >
                {interest}
              </span>
            ))
          ) : (
            <span className="text-body2 text-grayScale-400">미등록</span>
          )}
        </div>
      </ProfileInfoRow>
    
  </div>
);

const ProfileCallout = () => (
  <div className="flex w-full flex-col gap-4 rounded-[24px] border border-[#FFE3D6] bg-[#FAF8F7] px-6 py-8 text-center shadow-[0_20px_60px_rgba(255,77,0,0.08)]">
    <p className="text-body1 text-grayScale-title">
      프로필을 완성하면 나에게 딱 맞는 소모임을 추천받을 수 있어요.
    </p>
    <div className="flex justify-center">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full bg-[var(--color-key-100)] px-6 py-3 text-body1 text-white transition hover:opacity-90"
      >
        <Link href="/new-user-info">
        프로필 작성하러 가기
        </Link>
        <span className="text-[20px] leading-none">→</span>
      </button>
    </div>
  </div>
);

const LogoutConfirmModal = ({
  onCancel,
  onConfirm,
  isLoading,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-[540px] rounded-[28px] bg-white px-8 py-10 text-center shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
      <p className="text-h2 text-grayScale-title">로그아웃 하시겠습니까?</p>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border border-grayScale-400 px-4 py-3 text-body1 text-grayScale-title transition hover:bg-grayScale-100"
          disabled={isLoading}
        >
          아니요
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 rounded-full bg-gray-900 px-4 py-3 text-body1 text-white transition hover:bg-gray-800 disabled:opacity-60"
          disabled={isLoading}
        >
          네
        </button>
      </div>
    </div>
  </div>
);

const WithdrawInfoModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const adminEmail = 'lifestylehelpie@gmail.com';

  const notify = () => toast("복사 완료.");
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(adminEmail);
      notify();
    } catch (error) {
      console.error('이메일 복사 실패:', error);
      notify();
    }
  };

  const handleGoHome = () => {
    onClose();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[540px] rounded-[28px] bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="회원탈퇴 안내 닫기"
            className="text-grayScale-400 hover:text-grayScale-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mt-2 flex flex-col items-center gap-4">
          <h2 className="text-h2 text-grayScale-title">회원탈퇴를 진행하시겠어요?</h2>
          <p className="text-body2 text-grayScale-600">
            HELPie 회원탈퇴는 관리자 확인 후 처리됩니다. 아래 이메일 주소로 탈퇴 요청 메일을 보내주시면, 확인 후 계정이 안전하게 삭제됩니다.
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-[#FFF2EC] px-5 py-4 text-left">
          <p className="text-caption1 text-grayScale-500 mb-2">관리자 이메일 주소</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-body2 text-grayScale-title">
              <span className="text-lg">✉</span>
              <span>{adminEmail}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full bg-white px-4 py-2 text-body2 text-grayScale-title border border-grayScale-200 hover:bg-grayScale-50 transition"
            >
              복사
              <ToastContainer 
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              />
            </button>
          </div>
        </div>

        <p className="mt-4 text-caption1 text-grayScale-400">
          탈퇴 완료까지 최대 3영업일이 소요될 수 있습니다. 탈퇴 후에는 계정 복구가 불가능합니다.
        </p>

        <button
          type="button"
          onClick={handleGoHome}
          className="mt-8 w-full rounded-full bg-grayScale-title py-3 text-body1 text-white hover:bg-grayScale-900 transition"
        >
          홈 화면으로 돌아가기
        </button>
      </div>
    </div>
  );
};

const NicknameEditModal = ({
  currentNickname,
  newNickname,
  onChangeNickname,
  helperText,
  status,
  isChecking,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  currentNickname: string;
  newNickname: string;
  onChangeNickname: (value: string) => void;
  helperText: string;
  status: 'idle' | 'valid' | 'invalid';
  isChecking: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const isInvalid = status === 'invalid';
  const isValid = status === 'valid';
  const borderClass = isInvalid
    ? 'border-[#FF4D4D] focus:ring-[#FF4D4D] focus:border-[#FF4D4D]'
    : isValid
    ? 'border-[#21C45A] focus:ring-[#21C45A] focus:border-[#21C45A]'
    : 'border-grayScale-300 focus:ring-grayScale-400 focus:border-grayScale-400';

  const helperClass = isInvalid ? 'text-[#FF4D4D]' : 'text-grayScale-400';

  const disableSubmit = status !== 'valid' || isChecking || isSubmitting;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[540px] rounded-[28px] bg-white px-6 py-8 shadow-[0_16px_60px_rgba(0,0,0,0.3)]">
        <header className="mb-6 flex items-center gap-4">
        <button
            type="button"
            onClick={onClose}
            className="text-body1 text-grayScale-400 hover:text-grayScale-600"
            disabled={isSubmitting}
            aria-label="프로필 수정 닫기"
          >
            <Image
              src={ArrowIcon}
              alt="Close"
              width={14}
              height={14}
            />
          </button>
          <h2 className="font-pretendard font-semibold text-[20px] text-grayScale-title">프로필 수정</h2>
        </header>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2 space-y-2">
            <label htmlFor="current-nickname" className="text-caption1-regular text-grayScale-500">현재 사용 중인 별명</label>
            <input
              type="text"
              id="current-nickname"
              value={currentNickname}
              disabled
              className="w-full rounded-2xl border border-grayScale-200 bg-grayScale-100 px-4 py-3 text-body2 text-grayScale-500"
            />
          </div>

          <div className="flex flex-col gap-2 space-y-2">
            <label htmlFor="new-nickname" className="text-caption1-regular text-grayScale-500">새로운 별명</label>
            <div className="relative">
              <input
                type="text"
                id="new-nickname"
                value={newNickname}
                onChange={(event) => onChangeNickname(event.target.value)}
                maxLength={12}
                className={`w-full rounded-2xl border px-4 py-3 text-body2 outline-none transition ${borderClass}`}
                placeholder="새 별명을 입력해주세요."
              />
              {isInvalid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FF4D4D]">✕</span>
              )}
              {isValid && !isChecking && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#21C45A]">✓</span>
              )}
            </div>
            <p className={`text-caption1-regular ${helperClass}`}>{helperText}</p>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gray-900 py-3 text-body1 text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            disabled={disableSubmit}
          >
            {isSubmitting ? '변경 중...' : '변경하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;