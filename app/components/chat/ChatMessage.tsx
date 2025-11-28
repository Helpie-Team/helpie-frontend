'use client';

import React from 'react';
import { ChatMessage as ChatMessageType } from '@/app/api/types/chat/chat';
import { useMyProfileInfo } from '@/app/hooks/my-page/useMyProfileInfo';
import Image from 'next/image';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { data: profileInfo } = useMyProfileInfo();
  // senderId 비교 (숫자 타입 고려)
  const currentUserId = profileInfo?.surveyBasicInfo?.userId;
  const isMyMessage = currentUserId !== undefined && 
                      Number(currentUserId) === Number(message.senderId);
  const isSystemMessage = message.messageType === 'SYSTEM';

  // 오전/오후 시간 포맷
  const date = new Date(message.sentAt);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const formattedTime = `${period} ${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex mb-3 sm:mb-4 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-2 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} max-w-[85%] sm:max-w-[75%]`}>
        {/* 아바타 (상대방 메시지만 표시) */}
        {!isMyMessage && (
          message.senderProfileImage && message.senderProfileImage !== 'NO_IMAGE' ? (
            <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
              <Image
                src={message.senderProfileImage} 
                alt={message.senderName}
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
              <span className="text-xs text-gray-600 font-medium">{message.senderName.charAt(0)}</span>
            </div>
          )
        )}
        
        {/* 메시지 영역 */}
        <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} flex-1`}>
          {/* 발신자 이름 (상대방 메시지만 표시) */}
          {!isMyMessage && (
            <span className="text-xs text-gray-600 mb-1 px-1 font-medium">{message.senderName}</span>
          )}
          
          {/* 메시지 버블과 시간 */}
          <div className="flex items-end gap-2">
            {isMyMessage && (
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formattedTime}
              </span>
            )}
            
            {/* 메시지 버블 */}
            <div
              className={`px-3 py-2 rounded-[0.8rem] ${
                isMyMessage
                  ? 'bg-key-200 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
            </div>
            
            {!isMyMessage && (
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formattedTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

