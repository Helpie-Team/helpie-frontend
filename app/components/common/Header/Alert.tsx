'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useNotificationList, useDeleteAllNotifications, useQueryClient, UNREAD_COUNT_QUERY_KEY } from '@/app/hooks/notification/useNotification';
import { Notification } from '@/app/api/types/notification/notification';
import { notificationWebSocket } from '@/app/lib/websocket/notificationWebSocket';
import { useUserStore } from '@/app/lib/stores/userStore';
import { X } from 'lucide-react';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

const Alert: React.FC<AlertProps> = ({ isOpen, onClose, anchorRef }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userInfo } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: notificationData, refetch } = useNotificationList({ page: 0, size: 20 });
  const deleteAllMutation = useDeleteAllNotifications();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notificationData?.content) {
      setNotifications(notificationData.content);
    }
  }, [notificationData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    if (!isOpen || !userInfo?.result?.id) return;

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
  }, [isOpen, userInfo?.result?.id, refetch, queryClient]);

  const handleDeleteAll = async () => {
    try {
      await deleteAllMutation.mutateAsync();
      setNotifications([]);
    } catch (error) {
      console.error('전체 알림 삭제 실패:', error);
    }
  };

  const handleNavigateToFullPage = () => {
    onClose();
    router.push('/alert');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'COMMENT':
        return '댓글';
      case 'LIKE':
        return '공감';
      case 'REVIEW':
        return '리뷰작성';
      default:
        return type;
    }
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
        return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-[68px] right-[3rem] bg-white rounded-xl shadow-lg z-50 w-[400px] max-h-[600px] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
        <button
          onClick={handleNavigateToFullPage}
          className="text-base font-bold text-gray-900 flex items-center hover:text-gray-700"
        >
          알림 {'>'}
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDeleteAll}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            모두 지우기
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="닫기"
            aria-label="닫기"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            알림이 없습니다.
          </div>
        ) : (
          <div className="space-y-0">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="relative py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex flex-col gap-2">
                  {/* Category and Date Row */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getTypeColor(notification.type)}`}>
                      {getTypeLabel(notification.type)}
                    </span>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <p className="text-sm text-gray-900 line-clamp-3 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
