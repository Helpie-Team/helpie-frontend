'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useModalStore } from '@/app/lib/stores/modalStore';
import { isAuthenticated } from '@/app/lib/utils/token';
import {
  chatbotAnswers,
  chatbotCategories,
  chatbotQuestions,
  chatbotTopQuestions,
  type ChatbotAnswer,
  type ChatbotCategoryKey,
  type ChatbotItemKey,
  type ChatbotQuestion,
} from '@/app/lib/utils/chatbotQA';
import BackIcon from '@/public/icons/arrow_icon.svg';
import CloseChatBotImage from '@/public/icons/close_icon.svg';
import ChatBotImage from '@/public/images/helpie-chat-bot.png';
import HelpieChatBotImage from '@/public/images/helpie-chat-bot2.png';

type ChatStage = 'welcome' | 'faq' | 'category' | 'questionList' | 'answer';

type QAEntry = {
  question: ChatbotQuestion;
  answer: ChatbotAnswer;
  category: ChatbotCategoryKey;
};

type RouteMap = Record<string, string>;

type QuickReplyType = 'faq' | 'category';

type ChatBotState = {
  isOpen: boolean;
  stage: ChatStage;
  selectedCategory: ChatbotCategoryKey | null;
  selectedQuestionKey: ChatbotItemKey | null;
  isLoggedIn: boolean;
};

const routeMap: RouteMap = {
  'account-recovery-8-1': '/auth',
  'my-page/profile': '/my-page',
  'my-page/settings': '/my-page?tab=settings',
  'my-page/group': '/my-page',
  'my-page/activity': '/my-page',
  'group/main-3-0': '/matching',
  'group/create-3-1': '/matching',
  'survey/2-1': '/new-user-info',
  'support/contact-10-1': '/cs',
};

const modalTargetMap: Record<string, 'login' | 'signup'> = {
  'login-1-0': 'login',
  'signup-step-1-1': 'signup',
};

const ChatBot = () => {
  const router = useRouter();
  const { openModal } = useModalStore();

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<ChatBotState>({
    isOpen: false,
    stage: 'welcome',
    selectedCategory: null,
    selectedQuestionKey: null,
    isLoggedIn: false,
  });

  const { isOpen, stage, selectedCategory, selectedQuestionKey, isLoggedIn } = state;

  useEffect(() => {
    const syncLoginStatus = () =>
      setState((prev) => ({
        ...prev,
        isLoggedIn: isAuthenticated(),
      }));

    syncLoginStatus();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'accessToken') {
        syncLoginStatus();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setState((prev) => ({
        ...prev,
        isLoggedIn: isAuthenticated(),
      }));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickAway = (event: MouseEvent) => {
      const target = event.target as Node;
      const container = chatContainerRef.current;

      if (!container || container.contains(target)) {
        return;
      }

      setState((prev) => ({
        ...prev,
        isOpen: false,
        stage: 'welcome',
        selectedCategory: null,
        selectedQuestionKey: null,
      }));
    };

    document.addEventListener('mousedown', handleClickAway);

    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const container = messagesContainerRef.current;
    if (!container) return;

    const handle = requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });

    return () => cancelAnimationFrame(handle);
  }, [isOpen, stage, selectedCategory, selectedQuestionKey]);

  const qaMap = useMemo(() => buildQAMap(), []);
  const selectedQA = selectedQuestionKey ? qaMap.get(selectedQuestionKey) : undefined;

  const toggleOpen = () =>
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      stage: prev.isOpen ? 'welcome' : prev.stage,
      selectedCategory: prev.isOpen ? null : prev.selectedCategory,
      selectedQuestionKey: prev.isOpen ? null : prev.selectedQuestionKey,
    }));

  const handleResetChatBot = () =>
    setState((prev) => ({
      ...prev,
      stage: 'welcome',
      selectedCategory: null,
      selectedQuestionKey: null,
    }));

  const handleBackChatBot = () => {
    setState((prev) => {
      switch (prev.stage) {
        case 'welcome':
          return { ...prev, isOpen: false };
        case 'faq':
        case 'category':
          return { ...prev, stage: 'welcome', selectedCategory: null, selectedQuestionKey: null };
        case 'questionList':
          return { ...prev, stage: 'category', selectedQuestionKey: null };
        case 'answer':
          return {
            ...prev,
            stage: prev.selectedCategory ? 'questionList' : 'faq',
            selectedQuestionKey: null,
          };
        default:
          return prev;
      }
    });
  };

  const handleSelectQuickReply = (type: QuickReplyType) =>
    setState((prev) => ({
      ...prev,
      stage: type,
      selectedCategory: null,
      selectedQuestionKey: null,
    }));

  const handleSelectCategory = (category: ChatbotCategoryKey) =>
    setState((prev) => ({
      ...prev,
      selectedCategory: category,
      selectedQuestionKey: null,
      stage: 'questionList',
    }));

  const handleSelectQuestion = (key: ChatbotItemKey) =>
    setState((prev) => ({
      ...prev,
      selectedQuestionKey: key,
      stage: 'answer',
    }));

  const handleCtaClick = (ctaTarget?: string) => {
    if (!ctaTarget) return;

    if (ctaTarget in modalTargetMap) {
      openModal(modalTargetMap[ctaTarget]);
      setState((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    const route = routeMap[ctaTarget];
    if (route) {
      router.push(route);
    } else {
      console.warn(`아직 연결되지 않은 경로입니다: ${ctaTarget}`);
    }
  };

  const showFaqFlow = stage === 'faq' || (!selectedCategory && stage === 'answer');
  const showCategoryFlow =
    stage === 'category' || stage === 'questionList' || (!!selectedCategory && stage === 'answer');

  return (
    <>
      <ChatBotLauncher isOpen={isOpen} onToggle={toggleOpen} />

      {isOpen && (
        <div
          ref={chatContainerRef}
          className="chatbot-panel fixed bottom-20 right-6 flex h-[520px] w-[320px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_16px_40px_rgba(0,0,0,0.15)]"
        >
          <ChatBotHeader onBack={handleBackChatBot} onReset={handleResetChatBot} />

          <div
            ref={messagesContainerRef}
            className="chatbot-messages flex-1 overflow-y-auto bg-white px-4 pb-6 pt-8"
          >
            <div className="flex flex-col gap-4">
              <WelcomeMessage
                showQuickReplies={stage === 'welcome'}
                onSelectQuickReply={handleSelectQuickReply}
              />

              {stage !== 'welcome' && (
                <div className="flex flex-col gap-4">
                  {showFaqFlow && (
                    <FaqFlow
                      qaMap={qaMap}
                      onSelectQuestion={handleSelectQuestion}
                    />
                  )}

                  {showCategoryFlow && (
                    <CategoryFlow
                      selectedCategory={selectedCategory}
                      onSelectCategory={handleSelectCategory}
                      onSelectQuestion={handleSelectQuestion}
                      isLoggedIn={isLoggedIn}
                    />
                  )}

                  {stage === 'answer' && selectedQA && (
                    <AnswerSection
                      qa={selectedQA}
                      isLoggedIn={isLoggedIn}
                      onCtaClick={handleCtaClick}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ChatBotLauncher = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    title="ChatBot"
    onClick={onToggle}
    className={`chatbot-button-bounce ${isOpen ? '' : 'chatbot-launcher'} fixed bottom-2 right-6 rounded-full transition-opacity duration-300 hover:cursor-pointer hover:opacity-80`}
  >
    {isOpen ? (
      <div className="flex size-[60px] items-center justify-center rounded-[0.8rem] bg-grayScale-100">
        <Image src={CloseChatBotImage} alt="close-chatbot" width={18} height={18} />
      </div>
    ) : (
      <Image src={ChatBotImage} alt="chatbot" width={102} height={100} />
    )}
  </button>
);

const ChatBotHeader = ({
  onBack,
  onReset,
}: {
  onBack: () => void;
  onReset: () => void;
}) => (
  <div className="flex items-center justify-between rounded-t-3xl bg-grayScale-100 px-4 py-3">
    <div className="flex items-center gap-2">
      <button type="button" title="back" onClick={onBack} className="p-1">
        <Image src={BackIcon} alt="back" width={14} height={14} />
      </button>
      <p className="font-pretendard text-[15px] font-semibold text-grayScale-title">HELPie</p>
    </div>
    <button
      className="h-[28px] rounded-lg border border-grayScale-300 px-3 text-caption1-regular text-grayScale-500 transition hover:opacity-70"
      type="button"
      title="reset"
      onClick={onReset}
    >
      다른 질문하기
    </button>
  </div>
);

const WelcomeMessage = ({
  showQuickReplies,
  onSelectQuickReply,
}: {
  showQuickReplies: boolean;
  onSelectQuickReply: (type: QuickReplyType) => void;
}) => (
  <BotBubble classNameOverride="chatbot-welcome">
    <div className="flex flex-col gap-3">
      <p className="text-body1-regular text-grayScale-700">
        안녕하세요! Helpie의 엣치입니다! 무엇을 도와드릴까요?
      </p>
      <div className="h-px bg-grayScale-200" />
      <div className="flex flex-col gap-1 text-body2 text-grayScale-600">
        <span>✉️ E-mail 문의</span>
        <span className="font-medium">lifestylehelpie@gmail.com</span>
      </div>
      {showQuickReplies && (
        <div className="pt-2">
          <QuickReplyButtons onSelect={onSelectQuickReply} />
        </div>
      )}
    </div>
  </BotBubble>
);

const QuickReplyButtons = ({ onSelect }: { onSelect: (type: QuickReplyType) => void }) => (
  <div className="mt-3 flex flex-row gap-2">
    <QuickReplyButton label="자주 묻는 질문" onClick={() => onSelect('faq')} />
    <QuickReplyButton label="카테고리별 질문" onClick={() => onSelect('category')} />
  </div>
);

const QuickReplyButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    className="chatbot-button-bounce rounded-full border border-grayScale-200 px-3 py-1 text-body2 text-grayScale-600 transition hover:border-[var(--color-key-100)] hover:text-[var(--color-key-100)]"
    onClick={onClick}
  >
    {label}
  </button>
);

const FaqFlow = ({
  qaMap,
  onSelectQuestion,
}: {
  qaMap: Map<ChatbotItemKey, QAEntry>;
  onSelectQuestion: (key: ChatbotItemKey) => void;
}) => (
  <>
    <UserBubble>자주 묻는 질문</UserBubble>
    <BotBubble title="자주 묻는 질문 TOP 3">
      <div className="flex flex-col gap-2">
        {chatbotTopQuestions
          .map((key) => qaMap.get(key))
          .filter(Boolean)
          .map((qa) => (
            <QuestionButton key={qa!.question.key} question={qa!.question} onClick={onSelectQuestion} />
          ))}
      </div>
    </BotBubble>
  </>
);

const CategoryFlow = ({
  selectedCategory,
  onSelectCategory,
  onSelectQuestion,
  isLoggedIn,
}: {
  selectedCategory: ChatbotCategoryKey | null;
  onSelectCategory: (category: ChatbotCategoryKey) => void;
  onSelectQuestion: (key: ChatbotItemKey) => void;
  isLoggedIn: boolean;
}) => (
  <>
    <UserBubble>카테고리별 질문</UserBubble>
    <CategorySelector onSelect={onSelectCategory} />
    {selectedCategory && (
      <>
        <UserBubble>{chatbotCategories[selectedCategory].label}</UserBubble>
        <QuestionList
          category={selectedCategory}
          onSelectQuestion={onSelectQuestion}
          isLoggedIn={isLoggedIn}
        />
      </>
    )}
  </>
);

const CategorySelector = ({
  onSelect,
}: {
  onSelect: (category: ChatbotCategoryKey) => void;
}) => (
  <BotBubble title="아래에서 궁금한 내용을 선택해주세요.">
    <div className="flex flex-row gap-2">
      {(Object.entries(chatbotCategories) as [
        ChatbotCategoryKey,
        (typeof chatbotCategories)[ChatbotCategoryKey],
      ][]).map(([key, category]) => (
        <button
          key={key}
          type="button"
          className="chatbot-button-bounce flex size-[64px] flex-col items-center gap-2 rounded-2xl border border-grayScale-200 bg-white px-0 py-2 text-center transition hover:border-[var(--color-key-100)] hover:shadow-md"
          onClick={() => onSelect(key)}
        >
          <div className="relative h-[26px] w-[26px]">
            <Image
              src={category.icon}
              alt={category.title}
              fill
              className="object-contain"
              sizes="26px"
            />
          </div>
          <span className="text-[12px] text-grayScale-500">{category.label}</span>
        </button>
      ))}
    </div>
  </BotBubble>
);

const QuestionList = ({
  category,
  onSelectQuestion,
  isLoggedIn,
}: {
  category: ChatbotCategoryKey;
  onSelectQuestion: (key: ChatbotItemKey) => void;
  isLoggedIn: boolean;
}) => (
  <BotBubble title="궁금한 질문을 선택해주세요.">
    <div className="flex flex-col gap-2">
      {chatbotQuestions[category]
        .filter(
          (question) =>
            !(isLoggedIn && category === 'account' && question.key === 'account_email_verification'),
        )
        .map((question) => (
          <QuestionButton
            key={question.key}
            question={question}
            onClick={onSelectQuestion}
          />
        ))}
    </div>
  </BotBubble>
);

const QuestionButton = ({
  question,
  onClick,
}: {
  question: ChatbotQuestion;
  onClick: (key: ChatbotItemKey) => void;
}) => (
  <button
    type="button"
    className="chatbot-button-bounce w-full rounded-2xl border border-grayScale-200 px-4 py-3 text-left text-body2 text-grayScale-700 transition hover:border-[var(--color-key-100)] hover:text-[var(--color-key-100)]"
    onClick={() => onClick(question.key)}
  >
    {question.label.replace(/(^“|”$)/g, '')}
  </button>
);

const AnswerSection = ({
  qa,
  isLoggedIn,
  onCtaClick,
}: {
  qa: QAEntry;
  isLoggedIn: boolean;
  onCtaClick: (ctaTarget?: string) => void;
}) => {
  const { question, answer } = qa;
  const requiresAuth = answer.requiresAuth || question.requiresAuth;
  const showGuestMessage = requiresAuth && !isLoggedIn;

  const primaryMessage = showGuestMessage
    ? question.guestMessage ?? answer.guestMessage
    : answer.message;

  const ctaLabel = showGuestMessage ? answer.guestCtaLabel ?? question.guestCtaLabel : answer.ctaLabel;
  const ctaTarget = showGuestMessage ? answer.guestCtaTarget ?? question.guestCtaTarget : answer.ctaTarget;

  return (
    <>
      <UserBubble>{question.label.replace(/(^“|”$)/g, '')}</UserBubble>
      <BotBubble>
        <div className="flex flex-col gap-3">
          <p className="whitespace-pre-line text-body1-regular text-grayScale-700">{primaryMessage}</p>
          {ctaLabel && (
            <button
              type="button"
              className={
                showGuestMessage
                  ? 'chatbot-button-bounce h-11 rounded-2xl bg-[var(--color-key-100)] text-body2 text-white transition hover:opacity-90'
                  : 'chatbot-button-bounce h-11 rounded-2xl border border-[var(--color-key-100)] text-body2 text-[var(--color-key-100)] transition hover:bg-[var(--color-key-100)] hover:text-white'
              }
              onClick={() => onCtaClick(ctaTarget)}
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </BotBubble>
    </>
  );
};

const BotBubble = ({
  children,
  title,
  classNameOverride,
  timestamp,
}: {
  children: React.ReactNode;
  title?: string;
  classNameOverride?: string;
  timestamp?: string;
}) => {
  const displayTime = useMemo(() => timestamp ?? getCurrentTime(), [timestamp]);

  return (
    <div className={`${classNameOverride ?? 'chatbot-bubble'} relative flex flex-col items-start gap-2`}>
      <div className="flex-1 rounded-3xl bg-white px-2 py-3 shadow-sm">
        {title && <p className="mb-2 text-body2 text-grayScale-500">{title}</p>}
        {children}
      </div>
      <p className="text-caption1-regular text-grayScale-400">{displayTime}</p>
      <Image
        src={HelpieChatBotImage}
        alt="helpie-chat-bot"
        width={40}
        height={31}
        className="absolute -top-5 left-3"
      />
    </div>
  );
};

const UserBubble = ({
  children,
  timestamp,
}: {
  children: React.ReactNode;
  timestamp?: string;
}) => {
  const displayTime = useMemo(() => timestamp ?? getCurrentTime(), [timestamp]);

  return (
    <div className="chatbot-bubble flex flex-col items-end gap-2">
      <div className="max-w-[220px] rounded-3xl bg-[var(--color-key-100)] px-4 py-2 text-body2 text-white">
        {children}
      </div>
      <p className="text-caption1-regular text-grayScale-400">{displayTime}</p>
    </div>
  );
};

const buildQAMap = () => {
  const map = new Map<ChatbotItemKey, QAEntry>();

  (Object.entries(chatbotQuestions) as [ChatbotCategoryKey, ChatbotQuestion[]][]).forEach(
    ([categoryKey, questions]) => {
      const answers = chatbotAnswers[categoryKey];
      questions.forEach((question) => {
        const answer = answers.find((item) => item.key === question.key);
        if (answer) {
          map.set(question.key, { question, answer, category: categoryKey });
        }
      });
    },
  );

  return map;
};

const getCurrentTime = () =>
  new Date().toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  });

export default ChatBot;