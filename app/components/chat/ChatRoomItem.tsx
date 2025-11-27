'use client';

import React, { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChatRoom } from '@/app/api/types/chat/chat';
import { format, isToday, isYesterday, isThisYear } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import DefaultProfileImage from '@/public/images/helpie.png';
interface ChatRoomItemProps {
  room: ChatRoom;
}

export default function ChatRoomItem({ room }: ChatRoomItemProps) {
  const router = useRouter();
  const params = useParams();
  const currentRoomId = params?.roomId ? Number(params.roomId) : null;
  
  const isSelected = currentRoomId === room.id;

  // 미리보기 텍스트 (최대 2줄, 이미지처럼 두 줄로 표시)
  const previewText = useMemo(() => {
    if (!room.lastMessage) return '';
    const text = room.lastMessage;
    // 두 줄로 제한 (약 60자 정도, 공백 포함)
    // 너무 길면 생략 표시
    if (text.length <= 60) return text;
    return text.substring(0, 57) + '...';
  }, [room.lastMessage]);

  // 날짜 포맷팅
  const formattedDate = useMemo(() => {
    if (!room.lastMessageTime) {
      const date = new Date(room.createdAt);
      if (isToday(date)) {
        return format(date, 'HH:mm', { locale: ko });
      } else if (isThisYear(date)) {
        return format(date, 'M월d일', { locale: ko });
      }
      return format(date, 'yyyy-MM-dd', { locale: ko });
    }
    
    const date = new Date(room.lastMessageTime);
    if (isToday(date)) {
      return format(date, 'a h:mm', { locale: ko });
    } else if (isYesterday(date)) {
      return format(date, 'M월d일', { locale: ko });
    } else if (isThisYear(date)) {
      return format(date, 'M월d일', { locale: ko });
    }
    return format(date, 'yyyy-MM-dd', { locale: ko });
  }, [room.lastMessageTime, room.createdAt]);

  const handleClick = () => {
    // 즉시 채팅방으로 전환 (replace 사용하여 히스토리에 쌓지 않음)
    router.replace(`/chat/${room.id}`);
  };

  // 채팅방 이름 최대 7글자 (이미지 기준)
  const displayTitle = room.title.length > 7 ? room.title.substring(0, 7) + '...' : room.title;

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-4 border-b border-gray-200 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      {/* 아바타 */}
      <div className=" rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center   ">
        <Image
          src={room.profileImageUrl && room.profileImageUrl !== 'NO_IMAGE' ? room.profileImageUrl : DefaultProfileImage}
          alt={room.title}
          width={25}
          height={25}
          className="rounded-full"
        />
      </div>

      {/* 채팅방 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-gray-900 truncate">{displayTitle}</h3>
            <span className="text-sm text-gray-500">{room.currentParticipants}</span>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{formattedDate}</span>
        </div>
        
        {/* 미리보기 (최대 2줄) */}
        
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {previewText}
          </p>
        
      </div>
    </div>
  );
}

