'use client';

import Image from 'next/image';
import WelcomeImage from '@/public/images/wellcome_image.png';
import WellcomeIcon from '@/public/images/wellcome-helpie.png';
interface WelcomeModalProps {
  onSkip: () => void;
  onComplete: () => void;
}

export function WelcomeModal({  onSkip, onComplete }: WelcomeModalProps) {
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 md:p-0">
      <div className="bg-white rounded-[30px] overflow-hidden w-full max-w-4xl mx-4 flex flex-col md:flex-row">
        {/* 왼쪽 이미지 섹션 */}
        <div className="w-full md:w-1/2 relative h-48 md:h-auto overflow-hidden rounded-t-[30px] md:rounded-l-[30px] md:rounded-tr-none">
          <Image
            src={WelcomeImage}
            alt="Welcome"
            fill
            className="object-cover"
          />
        </div>

        {/* 오른쪽 컨텐츠 섹션 */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col relative">
          {/* 닫기 버튼 */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-black text-2xl hover:text-gray-700 z-10"
          >
            ×
          </button>

          {/* 프로필 플레이스홀더 */}
          <Image src={WellcomeIcon} alt="Welcome" width={52} height={50} className="mb-6 mt-4" />

          {/* 제목들 */}
          <h1 className="text-3xl font-bold text-black mb-2">
            Nice to Meet You :D
          </h1>
          <h2 className="text-2xl font-bold text-black mb-6">
            헬피에 오신 걸 환영합니다!
          </h2>

          {/* 설명 텍스트 */}
          <div className="flex-1 space-y-3 mb-6">
            <p className="text-black text-base leading-relaxed">
              낯선 도시에서도 당신이 빠르게 적응할 수 있도록, 헬피가 함께할게요.
            </p>
            <p className="text-black text-base leading-relaxed">
              프로필을 완성하시면 오직 나만을 위한 맞춤형 소모임을 추천받을 수 있습니다.
            </p>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="flex-1 py-4 rounded-full font-medium text-lg bg-white border-1 border-black text-black hover:bg-gray-50 transition-colors"
            >
              다음에 할게요
            </button>
            <button
              onClick={onComplete}
              className="flex-1 py-4 rounded-full font-medium text-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              프로필 완성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

