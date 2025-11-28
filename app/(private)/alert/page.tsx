'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ArrowLeft from '@/public/icons/arrow_left.png';
import CloseIcon from '@/public/icons/close_icon.svg';
import {
  useNotificationList,
  useDeleteAllNotifications,
  useDeleteNotification,
  useMarkNotificationAsRead,
  useQueryClient,
  UNREAD_COUNT_QUERY_KEY,
} from '@/app/hooks/notification/useNotification';
import { Notification } from '@/app/api/types/notification/notification';
import { notificationWebSocket } from '@/app/lib/websocket/notificationWebSocket';
import { useUserStore } from '@/app/lib/stores/userStore';

export default function AlertPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userInfo } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: notificationData, refetch, isLoading } = useNotificationList({ page: 0, size: 20 });
  const deleteAllMutation = useDeleteAllNotifications();
  const deleteMutation = useDeleteNotification();
  const markAsReadMutation = useMarkNotificationAsRead();

  useEffect(() => {
    if (notificationData?.content) {
      setNotifications(notificationData.content);
    }
  }, [notificationData]);

  useEffect(() => {
    if (!userInfo?.result?.id) return;

    // WebSocket 연결
    notificationWebSocket.connect(userInfo.result.id);

    // 새 알림 수신 핸들러
    const unsubscribeNotification = notificationWebSocket.onNotification((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
    });

    // 알림 개수 업데이트 핸들러
    const unsubscribeCount = notificationWebSocket.onCount(() => {
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
    });

    // 초기 알림 목록 로드
    refetch();

    return () => {
      unsubscribeNotification();
      unsubscribeCount();
    };
  }, [userInfo?.result?.id, refetch, queryClient]);

  const handleDeleteAll = async () => {
    if (window.confirm('모든 알림을 삭제하시겠습니까?')) {
      try {
        await deleteAllMutation.mutateAsync();
        setNotifications([]);
      } catch (error) {
        console.error('전체 알림 삭제 실패:', error);
      }
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteMutation.mutateAsync(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleSettingsClick = () => {
    router.push('/my-page?tab=settings');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'COMMENT':
        return 'text-blue-600';
      case 'LIKE':
        return 'text-orange-600';
      case 'REVIEW':
        return 'text-orange-600';
      default:
        return 'text-black';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-black hover:text-gray-600"
              title="뒤로가기"
              aria-label="뒤로가기"
            >
              <Image src={ArrowLeft} alt="뒤로가기" width={24} height={24} />
            </button>
            <h1 className="text-2xl font-bold text-black">알림</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 text-sm text-black border border-gray-300 rounded-3xl cursor-pointer hover:bg-gray-50"
            >
              모두삭제
            </button>
            <button
              onClick={handleSettingsClick}
              className="px-4 py-2 text-sm text-black border border-gray-300 rounded-3xl cursor-pointer hover:bg-gray-50"
            >
              설정
            </button>
          </div>
        </div>
      </div>

      <div className="px-14 py-4">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">로딩 중...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">알림이 없습니다.</div>
        ) : (
          <div className="space-y-0">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="relative py-4 border-b border-gray-200 last:border-b-0"
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {!notification.isRead && (
                    <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2" />
                  )}

                  <div className="flex-1 min-w-0 cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`font-bold ${getTypeColor(notification.type)}`}>
                        {notification.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                        title="알림 삭제"
                        aria-label="알림 삭제"
                      >
                        <Image src={CloseIcon} alt="삭제" width={16} height={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                      {notification.message}
                    </p>
                    <div className="flex justify-end">
                      <span className="text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
