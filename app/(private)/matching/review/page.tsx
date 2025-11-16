"use client";

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import arrow_left from "@/public/icons/arrow_left.png";
import Image from 'next/image';
import picture from '@/public/icons/picture.png';
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import { useCreateReview } from '@/app/hooks/review/useReview';
import { useGroupDetail } from '@/app/hooks/matching/useMatching';
import noImage from "@/public/images/noImage.png";
import { GroupCategory } from '@/app/api/types/matching/matching';

// 카테고리 한글 표시
const categoryDisplayNames: Record<GroupCategory, string> = {
  'ALL': '전체',
  'HOBBY': '문화·취미',
  'ART': '예술·창작',
  'LIFE': '액티비티·라이프',
  'STUDY': '자기계발·성장',
  'SOCIAL': '사회·교류',
};

function ReviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = Number(searchParams.get('groupId'));

  // 소모임 상세 정보 조회
  const { data: groupData, isLoading: isLoadingGroup } = useGroupDetail(groupId);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { mutate: createReview, isPending } = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // API 호출
    createReview(
      {
        groupId,
        reviewData: {
          anonymityYn: isAnonymous,
          rate: rating,
          description: review,
        },
        images: images.length > 0 ? images : undefined,
      },
      {
        onSuccess: (data) => {
          console.log('리뷰 작성 성공:', data);
          alert('리뷰가 성공적으로 등록되었습니다!');
          router.push('/matching');
        },
        onError: (error) => {
          console.error('리뷰 작성 실패:', error);
          alert('리뷰 등록에 실패했습니다.');
        },
      }
    );
  };

  const isFormValid = review.length >= 10 && review.length <= 500 && rating > 0;

  const getRatingText = (stars: number) => {
    if (stars === 1) return '아쉬웠어요';
    if (stars === 2) return '조금 아쉬웠어요';
    if (stars === 3) return '괜찮았어요';
    if (stars === 4) return '즐거웠어요';
    if (stars === 5) return '정말 좋았어요🧡';
    return '';
  };

  // groupId가 없으면 에러 표시
  if (!groupId || isNaN(groupId)) {
    return (
      <div className="flex flex-col w-[1000px] mx-auto pt-8 pb-20 items-center justify-center h-96">
        <p className="text-h2 text-grayScale-700 mb-4">잘못된 접근입니다</p>
        <button
          onClick={() => router.push('/matching')}
          className="px-6 py-3 bg-key-100 text-white rounded-full"
        >
          소모임 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[1000px] mx-auto pt-8 pb-20">
      {/* 헤더 */}
      <div className="w-full flex flex-col gap-6 mb-8 pb-8 border-b border-grayScale-100">
        <button title="뒤로가기" type="button" onClick={() => router.push('/matching')}>
          <Image src={arrow_left} alt="뒤로가기" width={40} height={40} />
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-head">후기 작성</h1>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid || isPending}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              isFormValid && !isPending
                ? 'bg-key-100 text-white'
                : 'bg-grayScale-100 text-grayScale-400 cursor-not-allowed'
            }`}
          >
            {isPending ? '등록 중...' : '작성완료'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8 border border-grayScale-200 bg-[#FAF8F7] rounded-[20px] p-6">
        {/* 모임완료 섹션 */}
        <div className="bg-grayScale-50 rounded-2xl p-6">
          <h2 className="text-body1-medium mb-4">모임완료</h2>
          {isLoadingGroup ? (
            <div className="text-body2-regular text-grayScale-500">모임 정보를 불러오는 중...</div>
          ) : groupData ? (
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0 relative">
                <Image
                  src={groupData.thumbnail && typeof groupData.thumbnail === 'string' && groupData.thumbnail.trim() !== '' ? groupData.thumbnail : noImage}
                  alt="모임 이미지"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = noImage.src;
                  }}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-body1-medium">{groupData.title}</h3>
                  <span className="text-caption1-regular text-grayScale-500">
                    {new Date(groupData.meetingDate).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="text-body3-regular text-grayScale-700 line-clamp-2">
                  {groupData.description}
                </p>
                <div className="flex items-center gap-3 text-caption1-regular text-grayScale-500">
                  <span className="flex items-center gap-1">📍 {groupData.cityName}</span>
                  <span className="flex items-center gap-1">👥 {groupData.maxMember}명</span>
                  <span className="flex items-center gap-1">🏷️ {categoryDisplayNames[groupData.category]}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-body2-regular text-grayScale-500">모임 정보를 불러올 수 없습니다.</div>
          )}
        </div>

        <hr className="border-t border-grayScale-100" />

        {/* 별점 섹션 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-h2">참여하신 모임은 어떠셨나요?</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-4xl transition-colors"
                >
                  <span className={star <= rating ? 'text-key-200' : 'text-grayScale-200'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-body2-regular text-grayScale-700">
                {getRatingText(rating)}
              </span>
            )}
          </div>
        </div>

        {/* 후기 텍스트 섹션 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-h2">자세한 후기를 남겨주세요!</h2>
          <div className="flex flex-col gap-2">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="모임 진행 후 가장 기억에 남는 일이나 참고할 만한 팁이 있다면 작성해 주세요!"
              maxLength={500}
              className="w-full h-48 px-4 py-3 border border-grayScale-200 bg-white rounded-xl text-body1 resize-none focus:outline-none focus:border-key-100"
            />
            <div className="flex justify-between items-center text-caption1-regular">
              <span className="text-grayScale-500">
                {review.length} / 500 최소 10자 이상
              </span>
            </div>
            <div className="flex flex-col gap-1 text-caption2-regular text-grayScale-500">
              <p>• 모임과 무관한 내용 혹은 동일한 문자의 반복 작성하지 않은 내용은 삭제될 수 있습니다.</p>
              <p>• 리뷰 작성 시 개인정보를 기입하지 않도록 주의해주세요.</p>
            </div>
          </div>
        </div>

        {/* 사진 공유하기 섹션 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-h2">사진 공유하기</h2>
            <span className="px-2 py-1 bg-grayScale-100 text-caption2-regular text-grayScale-600 rounded">
              선택
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              {/* 업로드된 이미지 미리보기 */}
              {images.map((image, index) => (
                <div key={index} className="relative w-40 h-40">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-grayScale-900 text-white rounded-full flex items-center justify-center hover:bg-grayScale-800"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* 업로드 버튼 - 3장 미만일 때만 표시 */}
              {images.length < 3 && (
                <label className="w-40 h-40 border-2 border-grayScale-200 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-key-100 transition-colors gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (images.length + files.length <= 3) {
                        setImages([...images, ...files]);
                      }
                    }}
                  />
                  <Image src={picture} alt="사진 업로드 아이콘" width={48} height={48} />
                  <span className="text-body3-regular text-grayScale-500">사진 업로드하기</span>
                </label>
              )}
            </div>
            <span className="text-caption2-regular text-grayScale-500">
              최대 3장 업로드 가능 ({images.length}/3)
            </span>
          </div>
        </div>

        {/* 익명 작성 체크박스 */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms-2"
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked === true)}
            className="bg-white border border-grayScale-300 text-white data-[state=checked]:bg-[#414141] data-[state=checked]:border-[#414141]"
          />
          <div className="grid gap-2">
            <Label htmlFor="terms-2" className="text-body2-regular text-grayScale-600 cursor-pointer">
              닉네임 비공개로 작성
            </Label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-body1 text-grayScale-600">로딩 중입니다...</p>
        </div>
      }
    >
      <ReviewPageContent />
    </Suspense>
  );
}