import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { aboutImageMap } from '@/app/lib/utils/aboutImagePaths';
import community from '@/public/icons/community.png'
import people from '@/public/icons/people.png'
export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - 메인 이미지와 텍스트 */}
            <section className="relative">
                {/* 배경 이미지 자리 (피그마 상단 이미지) */}
                <div className="w-full h-[600px] bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-bold mb-4">당신의 글로벌 라이프스타일 헬퍼</h1>
                        <div className="flex justify-center">
                            <div className="text-2xl font-bold bg-white text-orange-500 px-6 py-2 rounded-lg">
                                HELPie
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        <div className= "flex flex-col py-6 gap-50">
            {/* HELPie 브랜딩 섹션 */}
            <section className="py-16 bg-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-8">
                        <Image src={aboutImageMap.hepie} alt="helpie width4" width={942} height={142} className="justify-center items-center mb-4 mx-auto"/>
                    </div>
                </div>
            </section>

            {/* Our Mission 섹션 */}
            <section className="w-[942px] h-[471.22px] gap-10">
                <div className=" mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Mission</h2>
                    <div className="flex flex-row gap-3">
                        {/* 함께 나누기 */}
                        <div className="bg-white w-[306px] h-[393.22px] rounded-[20px] border border-grayScale-200 overflow-hidden shadow-sm">
                            <div className="p-6">
                                {/* 체크 아이콘 */}
                                <div className="flex items-center justify-start mb-4">
                                    <Image src={aboutImageMap.checkIcon} alt="체크 아이콘" width={16} height={16} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-black">함께 나누기</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    해외에서 살아가는 사람들이<br />
                                    실질적인 도움을 주고 받아요.
                                </p>
                            </div>
                            {/* 이미지 영역 */}
                            <div className="w-full h-[217.22px]">
                                <Image
                                    src={aboutImageMap.seperate}
                                    alt="삶을 전하기"
                                    width={306}
                                    height={217.22}
                                    className="w-full h-full object-cover rounded-5"
                                />
                            </div>
                        </div>

                        {/* 삶을 전하기 */}
                        <div className="bg-white w-[306px] h-[393.22px] rounded-[20px] border border-grayScale-200 overflow-hidden shadow-sm">
                            <div className="p-6">
                                {/* 체크 아이콘 */}
                                <div className="flex items-center justify-start mb-4">
                                    <Image src={aboutImageMap.checkIcon} alt="체크 아이콘" width={16} height={16} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-black">삶을 전하기</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    각자의 경험이 누군가에게 훌륭한<br />
                                    가이드가 될 수 있어요.
                                </p>
                            </div>
                            {/* 이미지 영역 */}
                            <div className="w-full h-[217px]">
                                <Image
                                    src={aboutImageMap.life}
                                    alt="삶을 전하기"
                                    width={306}
                                    height={217.22}
                                    className="w-full h-full object-cover rounded-5"
                                />
                            </div>
                        </div>

                        {/* 세 번째 카드 */}
                        <div className="bg-white w-[306px] h-[393.22px] rounded-[20px] border border-grayScale-200 overflow-hidden shadow-sm">
                            <div className="p-6">
                                {/* 체크 아이콘 */}
                                <div className="flex items-center justify-start mb-4">
                                    <Image src={aboutImageMap.checkIcon} alt="체크 아이콘" width={16} height={16} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-black">마음을 잇기</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    따뜻한 마음으로 서로를 이어주며<br />
                                    소중한 인연을 만들어 나가기
                                </p>
                            </div>
                            {/* 이미지 영역 */}
                            <div className="w-full h-[217.22px]">
                                <Image
                                    src={aboutImageMap.life2}
                                    alt="마음을 잇기"
                                    width={306}
                                    height={217.22}
                                    className="w-full h-full object-cover rounded-[20px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Service 섹션 */}
            <section className="bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center py-12">Our Service</h2>

                    <div className="w-full h-[540px] flex flex-col gap-13 ">
                        {/* 소모임 서비스 */}
                        <div className="w-full h-[244px] flex flex-row items-center gap-8">
                            <div className="flex-1 h-[244px] flex justify-center flex-col">
                                <div className="flex items-start text-start flex-col gap-8">
                                        <Image src={people} alt="사람아이콘" width={60} height={60}/>
                                        <div className='w-[461px] flex flex-col gap-4'>
                                            <div className="flex flex-row items-center gap-3">
                                                <h3 className="text-2xl font-bold">소모임</h3>
                                                <ExternalLink className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <p className="text-gray-600 text-h3 mb-0">
                                                같은 관심사로 모인 사람들과 이야기하며<br />
                                                현지 생활의 노하우를 나눠요.<br />
                                                경험을 공유하고, 가까운 이웃과 직접 만나 이야기를 이어가세요.
                                            </p>
                                        </div>
                                </div>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <Image
                                    src={aboutImageMap.matching}
                                    alt="소모임 서비스"
                                    width={461}
                                    height={244}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        </div>

                        {/* 커뮤니티 서비스 */}
                        <div className="w-full h-[244px] flex flex-row items-center gap-8">
                            <div className=" h-[244px] flex justify-center flex-col">
                                <div className="flex items-start text-start flex-col gap-8">
                                        <Image src={community} alt="사람아이콘" width={60} height={60}/>
                                        <div className='w-[461px] flex flex-col gap-4'>
                                            <div className="flex flex-row items-center gap-3">
                                                <h3 className="text-2xl font-bold">커뮤니티</h3>
                                                <span className="px-3 py-1 rounded-full bg-grayScale-100 text-grayScale-400 text-sm">준비중</span>
                                            </div>
                                            <p className="text-gray-600 text-h3 mb-0">
                                                관심 있는 주제나 지역의 사람들과 일상을 자유롭게 소통해요.<br />
                                                질문하고 답하며, 함께 성장하는 열린 커뮤니티를 만나보세요.
                                            </p>
                                        </div>
                                </div>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <Image
                                    src={aboutImageMap.community}
                                    alt="커뮤티니 서비스"
                                    width={461}
                                    height={244}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Logo 섹션 */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Our Logo</h2>
                    <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
                        이웃 개념이 적고 개인적인 소통이 부족한 환경에서 따뜻한 시각이 담긴 소통을 이어드리고
                        정보와 대한 안내를 제공하고자 밝고 부드러운 오렌지 색상을 메인 색상으로 사용하였습니다.
                    </p>

                    <div className="mb-12">
                        <p className="text-lg font-semibold mb-6">심볼</p>
                        <div className="flex justify-center items-center gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                                    <Image
                                        src={aboutImageMap.simbol1}
                                        alt="심볼 1"
                                        width={60}
                                        height={60}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                                    <Image
                                        src={aboutImageMap.simbol2}
                                        alt="심볼 2"
                                        width={60}
                                        height={60}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="w-24 h-24 bg-orange-500 rounded-full mb-2 flex items-center justify-center">
                                    <Image
                                        src={aboutImageMap.simbol3}
                                        alt="심볼 3"
                                        width={70}
                                        height={70}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg font-semibold mb-6">가로형</p>
                        <div className="flex justify-center items-center gap-8">
                            <div className="bg-gray-200 px-8 py-4 rounded">
                                <span className="text-gray-700 font-semibold">HELPie</span>
                            </div>
                            <div className="bg-gray-200 px-8 py-4 rounded">
                                <span className="text-orange-500 font-semibold">HELPie</span>
                            </div>
                            <div className="bg-orange-500 px-8 py-4 rounded">
                                <span className="text-white font-semibold">HELPie</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Character 섹션 */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Our Character</h2>
                    <p className="text-gray-600 mb-12">
                        서로 다른 곳에서 각자 살아가는 사람들 새로운 만남과<br />
                        인연을 이어주는 역할을 하는 친근한 캐릭터로 제작하였습니다.
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-4 text-orange-500">애리</h3>
                                <p className="text-gray-600 mb-6">
                                    따뜻함 + 밝음 + 희망성
                                </p>
                                <div className="w-48 h-64 bg-orange-200 rounded-full mx-auto flex items-center justify-center relative">
                                    <div className="w-32 h-48 bg-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-4xl">👋</span>
                                    </div>
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white px-3 py-1 rounded-full text-sm font-semibold text-orange-500">
                                        애리
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-4 text-blue-500">지파</h3>
                                <p className="text-gray-600 mb-6">
                                    신뢰 + 안정감 + 차분함
                                </p>
                                <div className="w-48 h-64 bg-blue-200 rounded-full mx-auto flex items-center justify-center relative">
                                    <div className="w-32 h-48 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-4xl">👋</span>
                                    </div>
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-500">
                                        지파
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </div>
    );
}