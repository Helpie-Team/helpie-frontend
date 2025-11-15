
import { ReactNode } from 'react';
import { Metadata } from 'next';
import OpenGraphImage from '@/public/images/3D_helpie_3.png';

export const metadata: Metadata = {
  title: 'Helpie',
  description: '간단한 설문으로 비슷한 시기, 같은 지역으로 떠나는 사람들을 자동으로 매칭해드려요. 매칭된 그룹에서는 정착 준비·정보 공유·소모임 일정까지 함께 나눌 수 있어요',

  openGraph: {
    title: 'Helpie',
    description: '간단한 설문으로 비슷한 시기, 같은 지역으로 떠나는 사람들을 자동으로 매칭해드려요. 매칭된 그룹에서는 정착 준비·정보 공유·소모임 일정까지 함께 나눌 수 있어요',
    images: OpenGraphImage.src,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Helpie',
    description: '간단한 설문으로 비슷한 시기, 같은 지역으로 떠나는 사람들을 자동으로 매칭해드려요. 매칭된 그룹에서는 정착 준비·정보 공유·소모임 일정까지 함께 나눌 수 있어요',
    images: OpenGraphImage.src,
  },
};

interface SubPagesLayoutProps {
  children: ReactNode;
}

export default function SubPagesLayout({ children }: SubPagesLayoutProps) {
  return (
    
    <main className="flex min-h-screen flex-col items-center justify-center px-16">
      {children}
    </main>
  );
}