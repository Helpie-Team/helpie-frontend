'use client';

import React, { useEffect } from 'react';
import { useChatRoom } from '@/app/hooks/chat/useChatRoom';
import { filterDuplicateMessages } from '@/app/utils/chat/filterMessages';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Image from 'next/image';
import DefaultProfileImage from '@/public/images/helpie.png';

export default function ChatRoom() {
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

  return (
    <div className="flex flex-col h-full bg-white w-full overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 flex-1">
          {/* 프로필 이미지 */}
          <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden">
            <Image 
              src={roomInfo.profileImageUrl && roomInfo.profileImageUrl !== 'NO_IMAGE' ? roomInfo.profileImageUrl : DefaultProfileImage} 
              alt={roomTitle}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 mb-2">{roomTitle}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{roomInfo.location || '서울'}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>{roomInfo.participants || 0}/{roomInfo.maxParticipants || 0}</span>
              </div>
              <span>{roomInfo.activityType || '액티비티·라이프'}</span>
            </div>
          </div>
        </div>
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="메뉴"
          aria-label="메뉴"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {/* 연결 오류 알림 */}
      {connectionError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-2 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
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
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
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
      <ChatInput onSend={handleSendMessage} disabled={!isConnected} />
    </div>
  );
}
