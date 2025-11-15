const ensureEnv = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const siteUrl = ensureEnv(process.env.NEXT_PUBLIC_SITE_URL, 'NEXT_PUBLIC_SITE_URL');
const withSiteUrl = (path: string) => `${siteUrl}${path}`;

export type ChatbotItemKey =
  | 'account_email_verification'
  | 'account_password_reset'
  | 'account_profile_photo'
  | 'account_language_change'
  | 'meetup_join'
  | 'meetup_create'
  | 'meetup_recommendation'
  | 'meetup_my_groups'
  | 'meetup_participant_limit'
  | 'meetup_not_satisfied'
  | 'system_notification'
  | 'system_file_upload'
  | 'system_ads'
  | 'system_bug_report'
  | 'support_contact'
  | 'support_collaboration';

export type ChatbotCategoryKey = 'account' | 'meetups' | 'system' | 'support';

export interface ChatbotQuestion {
  key: ChatbotItemKey;
  label: string;
  ctaLabel?: string;
  ctaTarget?: string;
  requiresAuth?: boolean;
  guestMessage?: string;
  guestCtaLabel?: string;
  guestCtaTarget?: string;
}

export interface ChatbotAnswer {
  key: ChatbotItemKey;
  message: string;
  ctaLabel?: string;
  ctaTarget?: string;
  requiresAuth?: boolean;
  guestMessage?: string;
  guestCtaLabel?: string;
  guestCtaTarget?: string;
}

const LOGIN_PROMPT_MESSAGE =
  '로그인 및 회원가입을 하시면 헬피가 더 자세히 도와드릴 수 있어요! (˶ᐢωᐢ˶)💕';

const LOGIN_CTA_LABEL = '로그인 하러가기';
const LOGIN_CTA_TARGET = 'login-1-0';

export const chatbotCategories: Record<
  ChatbotCategoryKey,
  {
    title: string;
    label: string;
    description: string;
    icon: string;
  }
> = {
  account: {
    title: '로그인·계정',
    label: '로그인·계정',
    description: '로그인 · 프로필 · 언어 설정 안내',
    icon: withSiteUrl('/images/categori_account.png'),
  },
  meetups: {
    title: '소모임·추천',
    label: '소모임·추천',
    description: '소모임 참여 · 생성 · 추천',
    icon: withSiteUrl('/images/categori_matching.png'),
  },
  system: {
    title: '시스템',
    label: '시스템',
    description: '알림 · 파일 업로드 · 광고',
    icon: withSiteUrl('/images/categori_system.png'),
  },
  support: {
    title: '고객센터',
    label: '고객센터',
    description: '문의 · 제안 · 협업',
    icon: withSiteUrl('/images/categori_help.png'),
  },
};

export const chatbotTopQuestions: ChatbotItemKey[] = [
  'meetup_recommendation',
  'meetup_join',
  'account_password_reset',
];

export const chatbotQuestions: Record<ChatbotCategoryKey, ChatbotQuestion[]> = {
  account: [
    {
      key: 'account_email_verification',
      label: '“이메일 인증이 안 돼요.”',
      ctaLabel: '회원가입 이동',
      ctaTarget: 'signup-step-1-1',
    },
    {
      key: 'account_password_reset',
      label: '“비밀번호를 잊어버렸어요.”',
      ctaLabel: '비밀번호 재설정',
      ctaTarget: 'account-recovery-8-1',
    },
    {
      key: 'account_profile_photo',
      label: '“프로필 사진을 바꾸고 싶어요.”',
      ctaLabel: '마이페이지 > 나의 프로필 이동',
      ctaTarget: 'my-page/profile',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'account_language_change',
      label: '“언어를 바꾸려면 어떻게 하나요?”',
      ctaLabel: '마이페이지 > 설정 이동',
      ctaTarget: 'my-page/settings',
    },
  ],
  meetups: [
    {
      key: 'meetup_join',
      label: '“소모임은 어떻게 참여하나요?”',
      ctaLabel: '소모임 메인페이지 이동',
      ctaTarget: 'group/main-3-0',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_create',
      label: '“소모임을 직접 만들 수 있나요?”',
      ctaLabel: '소모임 만들기 페이지 이동',
      ctaTarget: 'group/create-3-1',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_recommendation',
      label: '“소모임 추천은 어떻게 받나요?”',
      ctaLabel: '설문 페이지 이동',
      ctaTarget: 'survey/2-1',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_my_groups',
      label: '“내가 참여한 모임은 어디서 볼 수 있나요?”',
      ctaLabel: '마이페이지 > 나의 소모임 이동',
      ctaTarget: 'my-page/group',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_participant_limit',
      label: '“소모임 생성시 참여 인원 제한이 있나요?”',
      ctaLabel: '소모임 만들기 페이지 이동',
      ctaTarget: 'group/create-3-1',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_not_satisfied',
      label: '“추천 결과가 마음에 안 들어요.”',
      ctaLabel: '마이페이지 > 나의 프로필 이동',
      ctaTarget: 'my-page/profile',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
  ],
  system: [
    {
      key: 'system_notification',
      label: '“알림이 오지 않아요.”',
      ctaLabel: '마이페이지 > 설정 4.3.3 이동',
      ctaTarget: 'my-page/settings',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'system_file_upload',
      label: '“파일이 안 올라가요.”',
    },
    {
      key: 'system_ads',
      label: '“광고가 너무 많이 나와요.”',
    },
    {
      key: 'system_bug_report',
      label: '“버그나 오류를 제보하고 싶어요.”',
      ctaLabel: '고객센터 > 문의 페이지 이동',
      ctaTarget: 'support/contact-10-1',
    },
  ],
  support: [
    {
      key: 'support_contact',
      label: '“직접 문의하고 싶어요.”',
      ctaLabel: '고객센터 > 문의 페이지 이동',
      ctaTarget: 'support/contact-10-1',
    },
    {
      key: 'support_collaboration',
      label: '“제안이나 협업 문의를 하고 싶어요.”',
      ctaLabel: '고객센터 > 문의 페이지 이동',
      ctaTarget: 'support/contact-10-1',
    },
  ],
};

export const chatbotAnswers: Record<ChatbotCategoryKey, ChatbotAnswer[]> = {
  account: [
    {
      key: 'account_email_verification',
      message:
        '앗, 혹시 스팸함 확인을 해보셨나요? 그래도 인증이 어려우시다면 다시 한번 이메일을 입력해주세요. (人>_<)꜆꜄',
      ctaLabel: '회원가입 이동',
      ctaTarget: 'signup-step-1-1',
    },
    {
      key: 'account_password_reset',
      message: '비밀번호 재설정 페이지로 안내해드릴게요. ( •̀∀•́ )✧',
      ctaLabel: '비밀번호 재설정',
      ctaTarget: 'account-recovery-8-1',
    },
    {
      key: 'account_profile_photo',
      message:
        '프로필은 마이페이지 > 나의 프로필에서 수정할 수 있어요! 해당 페이지로 안내해드릴게요. ( •̀∀•́ )✧',
      ctaLabel: '마이페이지 > 나의 프로필 이동',
      ctaTarget: 'my-page/profile',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'account_language_change',
      message:
        '언어 설정은 마이페이지 > 설정에서 수정할 수 있어요! 현재 헬피에서 지원하는 언어는 한국어/English 에요. ʚ(•”̮•)ɞ',
      ctaLabel: '마이페이지 > 설정 이동',
      ctaTarget: 'my-page/settings',
    },
  ],
  meetups: [
    {
      key: 'meetup_join',
      message:
        '소모임 메인 페이지로 안내해드릴게요. 관심있는 소모임의 참여신청 버튼을 클릭하시면 돼요! (ง •̀ω•́)ง✧',
      ctaLabel: '소모임 메인페이지 이동',
      ctaTarget: 'group/main-3-0',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_create',
      message: '그럼요! 소모임 만들기 페이지로 안내 해드릴게요. (,,• •,,)♥',
      ctaLabel: '소모임 만들기 페이지 이동',
      ctaTarget: 'group/create-3-1',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_recommendation',
      message:
        '프로필을 작성해주시면 헬피가 관심사를 분석해서 맞춤형 소모임을 추천해드려요! (,, ･∀･)ﾉ゛',
      ctaLabel: '설문 페이지 이동',
      ctaTarget: 'survey/2-1',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_my_groups',
      message:
        '마이페이지 > 나의 소모임에서 예정된 모임, 지난 모임, 관심있는 모임 등을 확인할 수 있어요! (´,,>ω<,,`) 해당 페이지로 안내해드릴게요.',
      ctaLabel: '마이페이지 > 나의 소모임 이동',
      ctaTarget: 'my-page/group',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_participant_limit',
      message:
        '최소 인원인 3명 이상이라면 인원 제한은 없어요! 소모임 만들기 페이지로 이동할까요? (ᴗ͈ . ᴗ͈)',
      ctaLabel: '소모임 만들기 페이지 이동',
      ctaTarget: 'group/create-3-1',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'meetup_not_satisfied',
      message:
        '(ó ̯ ò, )혹시 관심사가 바뀌셨다면 프로필을 수정해주시면 헬피가 더 잘맞는 소모임을 추천해드릴게요.',
      ctaLabel: '마이페이지 > 나의 프로필 이동',
      ctaTarget: 'my-page/profile',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
  ],
  system: [
    {
      key: 'system_notification',
      message: '알림 설정은 마이페이지 > 설정에서 수정할 수 있어요! (´,,•ω•,,)♡',
      ctaLabel: '마이페이지 > 설정 이동',
      ctaTarget: 'my-page/settings',
      requiresAuth: true,
      guestMessage: LOGIN_PROMPT_MESSAGE,
      guestCtaLabel: LOGIN_CTA_LABEL,
      guestCtaTarget: LOGIN_CTA_TARGET,
    },
    {
      key: 'system_file_upload',
      message: '앗, 업로드가 가능한 파일의 형식은 JPG, PNG, 5MB 이하에요. ( •̛̣̣꒶̯•̛̣̣ )',
    },
    {
      key: 'system_ads',
      message: '피드백 주셔서 감사해요. 더 좋은 헬피가 되도록 노력할게요. (˵ •ᴗ• ˵)♡',
    },
    {
      key: 'system_bug_report',
      message:
        '헬피에게 버그나 오류 소식을 알려주시면 더욱 발전된 헬피가 될 수 있어요(*ᴗ͈ˬᴗ͈)ꕤ*.ﾟ 아래 이메일로 내용을 제보해주세요.\n\nlifestylehelpie@gmail.com',
      ctaLabel: '고객센터 > 문의 페이지 이동',
      ctaTarget: 'support/contact-10-1',
    },
  ],
  support: [
    {
      key: 'support_contact',
      message:
        '헬피는 언제나 환영해요! (੭•̀ω•́)੭̸*✩⁺˚ 아래 이메일로 문의 주세요.\n\nlifestylehelpie@gmail.com',
      ctaLabel: '고객센터 > 문의 페이지 이동',
      ctaTarget: 'support/contact-10-1',
    },
    {
      key: 'support_collaboration',
      message:
        '헬피는 언제나 환영해요! (੭•̀ω•́)੭̸*✩⁺˚ 아래 이메일로 문의 주세요.\n\nlifestylehelpie@gmail.com',
      ctaLabel: '고객센터 > 문의 페이지 이동',
      ctaTarget: 'support/contact-10-1',
    },
  ],
};