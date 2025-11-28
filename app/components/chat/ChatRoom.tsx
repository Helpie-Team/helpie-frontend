'use client';

import React, { useEffect } from 'react';
import { useChatRoom } from '@/app/hooks/chat/useChatRoom';
import { filterDuplicateMessages } from '@/app/utils/chat/filterMessages';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Image from 'next/image';
import DefaultProfileImage from '@/public/images/helpie.png';
// import { EllipsisVertical } from 'lucide-react';
import { MapPinIcon, UsersIcon, TagIcon, AlertTriangleIcon, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function ChatRoom() {
  const router = useRouter();
  const {
    roomId,
    roomTitle,
    roomInfo,
    roomMessages,
    isLoading,
    connectionError,
    isConnected,
    messagesEndRef,
    messagesContainerRef,
    handleScroll,
    loadMoreMessages,
    handleSendMessage,
    setConnectionError,
    hasMoreMessages,
  } = useChatRoom();

  // 메시지가 변경될 때마다 마지막 메시지로 스크롤
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      // 약간의 지연을 두어 DOM이 업데이트된 후 스크롤
      setTimeout(() => {
        // scrollIntoView 대신 scrollTop을 직접 조작하여 채팅방 내부만 스크롤
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [roomMessages, messagesEndRef, messagesContainerRef]);

  if (!roomId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">채팅방을 찾을 수 없습니다</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">채팅방을 불러오는 중...</p>
      </div>
    );
  }

  const filteredMessages = filterDuplicateMessages(roomMessages);

  const handleBack = () => {
    router.push('/chat');
  };

  return (
    <div className="flex flex-col h-full bg-white w-full overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* 모바일 뒤로가기 버튼 */}
          <button
            onClick={handleBack}
            className="sm:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          {/* 프로필 이미지 */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 overflow-hidden">
            <Image 
              src={roomInfo.profileImageUrl && roomInfo.profileImageUrl !== 'NO_IMAGE' ? roomInfo.profileImageUrl : DefaultProfileImage} 
              alt={roomTitle}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 truncate">{roomTitle}</h1>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{roomInfo.location || '서울'}</span>
              </div>
              <div className="flex items-center gap-1">
                <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{roomInfo.participants || 0}/{roomInfo.maxParticipants || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <TagIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{roomInfo.activityType || '액티비티·라이프'}</span>
              </div>
            </div>
          </div>
        </div>
        {/* <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="메뉴"
          aria-label="메뉴"
        >
          <EllipsisVertical size={24} className="text-gray-600" />
        </button> TODO: 추 후 작업 예정*/}
      </div>

      {/* 연결 오류 알림 */}
      {connectionError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-2 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangleIcon className="w-4 h-4 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">{connectionError}</p>
            </div>
            <button
              onClick={() => setConnectionError(null)}
              className="text-yellow-400 hover:text-yellow-600"
              aria-label="닫기"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50"
      >
        {hasMoreMessages && (
          <div className="flex justify-center mb-4">
            <button
              onClick={loadMoreMessages}
              className="text-sm text-key-100 hover:text-key-200"
            >
              이전 메시지 더보기
            </button>
          </div>
        )}
        {filteredMessages.map((message, index) => (
          <ChatMessage key={`${message.id}-${message.sentAt}-${index}`} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="sm:block">
        <ChatInput onSend={handleSendMessage} disabled={!isConnected} />
      </div>
    </div>
  );
}
