//JoinModal.tsx
//3.2.1.0 소모임참여하기
"use client";
import React, { useState } from "react";
import arrow_left from '@/public/icons/arrow_left.png';
import Image from "next/image";
import {  MapPin, Users, Tag, Clock } from "lucide-react";
import noImage from "@/public/images/noImage.png";
import JoinConfirm from '@/app/components/matching/modal/JoinConfirm';
import CancelModal from "./CancelModal";
import ChatModal from "./ChatModal";
import { useGroupDetail, useJoinGroup, useCancelGroup, useJoinStatus } from "@/app/hooks/matching/useMatching";
import { GroupCategory, GroupDetail } from "@/app/api/types/matching/matching";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MY_GROUP_INFO_QUERY_KEY } from "@/app/hooks/my-page/useMyGroupInfo";
import { ToastContainer, toast } from "react-toastify";
// import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "@/app/lib/utils/token";
// 카테고리 한글 표시
const categoryDisplayNames: Record<GroupCategory, string> = {
  'ALL': '전체',
  'HOBBY': '문화·취미',
  'ART': '예술·창작',
  'LIFE': '액티비티·라이프',
  'STUDY': '자기계발·성장',
  'SOCIAL': '사회·교류',
};

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
}

export default function JoinModal({ isOpen, onClose, groupId }: JoinModalProps) {
  // const router = useRouter();
  const queryClient = useQueryClient();
  const {data: groupDetailData, isLoading, error} = useGroupDetail(groupId);

  // 로그인 여부 확인 - hydration 오류 방지를 위해 isAuthenticated 함수 사용
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  const isLoggedIn = isClientMounted ? isAuthenticated() : false;

  // 로그인한 경우에만 가입 여부 조회
  const {data: joinStatusData, refetch: refetchJoinStatus} = useJoinStatus(isLoggedIn ? groupId : undefined);

  // 모달이 열릴 때마다 가입 상태 최신화 + 마이페이지 동기화 체크
  useEffect(() => {
    if (isOpen && isLoggedIn && groupId) {
      // refetch 후 결과 검증
      refetchJoinStatus().then((result) => {
        // 🔧 추가 검증: 캐시에서 이미 false로 설정되어 있는지 확인
        const cachedStatus = queryClient.getQueryData(['group', 'join-status', groupId]) as {joinYn: boolean} | undefined;

        if (result.data?.joinYn === true && cachedStatus?.joinYn === false) {
          // 서버에서는 true인데 캐시에서는 false라면 마이페이지에서 취소했을 가능성이 높음
          queryClient.setQueryData(['group', 'join-status', groupId], {
            joinYn: false
          });
        }
      }).catch((error) => {
        console.error(`❌ 가입 상태 확인 실패:`, error);
      });
    }
  }, [isOpen, isLoggedIn, groupId, refetchJoinStatus, queryClient]);
  const joinGroupMutation = useJoinGroup();
  const cancelGroupMutation = useCancelGroup();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancleModalOpen, setIsCancleModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<number | undefined>(undefined);

  // API에서 가져온 가입 여부 (로그인한 경우에만)
  const isJoined = isLoggedIn ? (joinStatusData?.joinYn ?? false) : false;

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 참여하기 버튼 클릭 (JoinConfirm 모달 열기)
  const handleJoinClick = () => {
    setIsModalOpen(true);
  };

  // JoinConfirm 모달에서 "좋아요!" 버튼 클릭 (실제 API 호출)
  const handleConfirm = async () => {
    try {
      const response = await joinGroupMutation.mutateAsync(groupId);
      // roomId 저장
      if (response?.roomId) {
        setChatRoomId(response.roomId);
      }
      setIsModalOpen(false);

      // QueryClient를 사용하여 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['group', 'join-status', groupId]
      });

      queryClient.invalidateQueries({ queryKey: MY_GROUP_INFO_QUERY_KEY });

      // 성공 toast 알림
      toast.success('소모임 신청이 완료되었습니다! 🎉');
    } catch (error: unknown) {
      console.error('소모임 가입 실패:', error);
      setIsModalOpen(false);

      // 에러 메시지 파싱
      const errorMessage = (error as {response?: {data?: {message?: string}}; message?: string})?.response?.data?.message
        || (error as {message?: string})?.message
        || '알 수 없는 오류가 발생했습니다.';

      // 중복 참여 에러 처리 - 가입 여부 다시 확인
      if (errorMessage.includes('이미') || errorMessage.includes('중복') || errorMessage.includes('Duplicate') || errorMessage.includes('가입된')) {
        toast.warn('이미 참여 신청한 소모임입니다.');
        // 실제 가입 상태를 강제로 확인
        try {
          await queryClient.invalidateQueries({
            queryKey: ['group', 'join-status', groupId]
          });
          await refetchJoinStatus();
        } catch (refetchError) {
          console.error('가입 상태 확인 실패:', refetchError);
        }
      }
    }
  };


  // CancelModal에서 "신청 취소" 버튼 클릭 (실제 API 호출)
  const handleCancelConfirm = async () => {
    try {
      await cancelGroupMutation.mutateAsync(groupId);

      setIsCancleModalOpen(false);
      toast.success('소모임 참여 신청이 취소되었습니다.');
    } catch {
      toast.warn('에러 발생');
    }
  };

  // 로딩 상태 - 데이터 로딩 중이거나 클라이언트 마운트 대기 중
  if (isLoading || !isClientMounted) {
    return (
      <div onClick={handleBackdropClick} className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50">
        <div className="bg-white rounded-[30px] p-8">
          <p className="text-body1">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !groupDetailData) {
    return (
      <div onClick={handleBackdropClick} className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50">
        <div className="bg-white rounded-[30px] p-8">
          <p className="text-body1 text-red-500">소모임 정보를 불러오는데 실패했습니다.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">닫기</button>
        </div>
      </div>
    );
  }

  // API 응답 데이터 (직접 GroupDetail 반환)
  const groupData: GroupDetail = groupDetailData;

  // const handleGoToChat = () => {
  //   if (!chatRoomId) return;
  //   router.push(`/chat/${chatRoomId}`);
  // };
  return (
    <div
      id="모달 외부"
      onClick={handleBackdropClick}
      className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50"
    >
      <div
        id="모달 내부"
        className="w-[736px] bg-white rounded-[30px] p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="hover:bg-gray-100 rounded-full transition-colors">
              <Image
                src={arrow_left}
                alt="뒤로 가기"
                width={30}
                height={30}
              />
            </button>
            <h2 className="text-h2">모임요약</h2>
          </div>
          {/* <button
            onClick={() => setIsShareModalOpen(true)}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <Share2 className="w-6 h-6" />
          </button> */}
        </div>

        {/* 이미지  */}
        <div className="flex gap-4">
          <div className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden">
            <Image
              src={groupData.thumbnail && typeof groupData.thumbnail === 'string' && groupData.thumbnail.trim() !== '' ? groupData.thumbnail : noImage}
              alt={groupData.title}
              width={672}
              height={320}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = noImage.src;
              }}
            />
          </div>
        </div>

        {/* 모임 정보 */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-3 items-center">
          <h1 className="text-h1 ">{groupData.title}</h1>

          {/* 아이콘 정보 */}
          <div className="flex items-center gap-3 text-body3 text-grayScale-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{groupData.cityName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="text-grayScale-400">{groupData.maxMember}명</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{categoryDisplayNames[groupData.category]}</span>
            </div>
            {groupData.isPopular && (
              <div className="flex items-center gap-1 text-key-100">
                <span>🔥 인기</span>
              </div>
            )}
          </div>
          </div>

          {/* 날짜/시간 */}
          <div className="flex items-center gap-3 text-h3-regular text-grayScale-600">
            <Clock className="w-5 h-5" />
            <span>{new Date(groupData.meetingDate).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}</span>
            <span className="text-key-100">D-{groupData.dayBefore}</span>
          </div>

          {/* 설명 */}
          <p className="text-h3-regular text-grayScale-600 whitespace-pre-line">
            {groupData.description}
          </p>

          {/* 상태 표시 */}
          {groupData.status !== 'RECRUITING' && (
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-body3-sb ${
                groupData.status === 'RECRUITMENT_CLOSED' ? 'bg-orange-100 text-orange-600' :
                groupData.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : ''
              }`}>
                {groupData.status === 'RECRUITMENT_CLOSED' ? '모집 마감' :
                 groupData.status === 'COMPLETED' ? '완료됨' : groupData.status}
              </span>
            </div>
          )}
        </div>

        {/* 버튼 영역 - 가입 여부에 따라 다른 버튼 표시 */}
        {isJoined ? (
          /* 가입한 모임 - 신청취소 + 채팅방으로 이동 */
          <div className="w-full flex flex-row gap-3">
            <button
              onClick={()=> {
                setIsCancleModalOpen(true);
              }}
              className="flex-1 py-4 bg-grayScale-100 text-grayScale-700 text-h3-sb rounded-full hover:bg-grayScale-200 transition-colors"
            >
              신청취소
            </button>
            <button
            
              className="flex-1 py-4 bg-grayScale-700 text-white rounded-full text-h3-sb hover:bg-grayScale-800 transition-colors"
            >
              채팅방으로 이동
            </button>
          </div>
        ) : (
          /* 가입하지 않은 모임 - 참여하기 */
          <button
            onClick={handleJoinClick}
            disabled={groupData.status !== 'RECRUITING'}
            className={`w-full py-4 rounded-full text-h3-sb transition-colors ${
              groupData.status === 'RECRUITING'
                ? 'bg-grayScale-700 text-white hover:bg-grayScale-800'
                : 'bg-grayScale-200 text-grayScale-400 cursor-not-allowed'
            }`}
          >
            {groupData.status === 'RECRUITING' ? '참여하기' :
             groupData.status === 'RECRUITMENT_CLOSED' ? '모집 마감' :
             '참여 불가'}
          </button>
        )}
      </div>

      {/* 참여 확인 모달 */}
      <JoinConfirm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />

      {/* 신청취소 모달 */}
      <CancelModal
        isOpen={isCancleModalOpen}
        onClose={() => setIsCancleModalOpen(false)}
        onConfirm={handleCancelConfirm}
      />
      {/* 채팅방으로 이동 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        roomId={chatRoomId}
      />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
      />
    </div>
  );
}