"use client";

import React from 'react';
import Image from 'next/image';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { aboutImageMap } from '@/app/lib/utils/aboutImagePaths';
import community from '@/public/icons/community.png'
import people from '@/public/icons/people.png'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AboutPage() {
    const router = useRouter();

    // 애니메이션 variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 }
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const slideInLeft = {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 }
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <>
            {/* Hero Section - 메인 이미지와 텍스트 */}
            <section className="relative w-screen h-[797px] overflow-hidden -mx-[calc((100vw-100%)/2)]">
                {/* 배경 이미지 */}
                <Image
                    src={aboutImageMap.cover}
                    alt="HELPie Cover"
                    fill
                    className="object-cover"
                    priority
                />
                {/* 오버레이 (텍스트 가독성을 위한 반투명 레이어) */}
                <div className="absolute inset-0 bg-black/20" />

                {/* 텍스트 컨텐츠 */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="text-center text-white z-10"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.8 }}
                    >
                    </motion.div>
                </div>

                {/* 아래 화살표 - 스크롤 유도 */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 1,
                        delay: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 0.5
                    }}
                >
                    <ChevronDown className="w-12 h-12 text-white" strokeWidth={2} />
                </motion.div>
            </section>

        <div className="min-h-screen bg-white">
        <div className= "flex flex-col py-6 gap-50">
            {/* HELPie 브랜딩 섹션 */}
            <motion.section
                className="py-16 bg-white text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                variants={fadeInUp}
            >
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-8">
                        <Image src={aboutImageMap.hepie} alt="helpie width4" width={942} height={142} className="justify-center items-center mb-4 mx-auto"/>
                    </div>
                </div>
            </motion.section>

            {/* Our Mission 섹션 */}
            <section className="w-[942px] h-[471.22px] gap-10">
                <div className=" mx-auto">
                    <motion.h2
                        className="text-3xl font-bold text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                    >
                        Our Mission
                    </motion.h2>
                    <div className="flex flex-row gap-3">
                        {/* 함께 나누기 */}
                        <motion.div
                            className="bg-white w-[306px] h-[393.22px] rounded-[20px] border border-grayScale-200 overflow-hidden shadow-sm"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            variants={fadeInUp}
                        >
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
                        </motion.div>

                        {/* 삶을 전하기 */}
                        <motion.div
                            className="bg-white w-[306px] h-[393.22px] rounded-[20px] border border-grayScale-200 overflow-hidden shadow-sm"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            variants={fadeInUp}
                        >
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
                        </motion.div>

                        {/* 세 번째 카드 */}
                        <motion.div
                            className="bg-white w-[306px] h-[393.22px] rounded-[20px] border border-grayScale-200 overflow-hidden shadow-sm"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            variants={fadeInUp}
                        >
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
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Service 섹션 */}
            <section className="bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2
                        className="text-3xl font-bold text-center py-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                    >
                        Our Service
                    </motion.h2>

                    <div className="w-full h-[540px] flex flex-col gap-13">
                        {/* 소모임 서비스 */}
                        <motion.div
                            className="w-full h-[244px] flex flex-row items-center gap-8"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            variants={slideInLeft}
                        >
                            <div className="flex-1 h-[244px] flex justify-center flex-col">
                                <div className="flex items-start text-start flex-col gap-16">
                                        <Image src={people} alt="사람아이콘" width={60} height={60}/>
                                        <div className='w-[461px] flex flex-col gap-4'>
                                            <div className="flex flex-row items-center gap-3">
                                                <h3 className="text-2xl font-bold">소모임</h3>
                                                <ExternalLink className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => router.push('/matching')} />
                                            </div>
                                            <p className="text-gray-600 text-h3 mb-0">
                                                같은 관심사로 모인 사람들과 이야기하며<br />
                                                현지 생활의 노하우를 나눠요.<br />
                                                경험을 공유하고, 가까운 이웃과 직접 만나 이야기를 이어가세요.
                                            </p>
                                        </div>
                                </div>
                            </div>
                            <motion.div
                                className="flex-1 flex justify-end"
                                variants={slideInRight}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Image
                                    src={aboutImageMap.matching}
                                    alt="소모임 서비스"
                                    width={461}
                                    height={244}
                                    className="rounded-lg object-cover"

                                />
                            </motion.div>
                        </motion.div>

                        {/* 커뮤니티 서비스 */}
                        <motion.div
                            className="w-full h-[244px] flex flex-row items-center gap-8"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            variants={slideInLeft}
                        >
                            <div className=" h-[244px] flex justify-center flex-col">
                                <div className="flex items-start text-start flex-col gap-20">
                                        <Image src={community} alt="지구 아이콘" width={60} height={60}/>
                                        <div className='w-[461px] flex flex-col gap-4'>
                                            <div className="flex flex-row items-center gap-3">
                                                <h3 className="text-2xl font-bold">커뮤니티</h3>
                                                <ExternalLink className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => router.push('/community')} />
                                            </div>
                                            <p className="text-gray-600 text-h3 mb-0">
                                                관심 있는 주제나 지역의 사람들과 일상을 자유롭게 소통해요.<br />
                                                질문하고 답하며, 함께 성장하는 열린 커뮤니티를 만나보세요.
                                            </p>
                                        </div>
                                </div>
                            </div>
                            <motion.div
                                className="flex-1 flex justify-end"
                                variants={slideInRight}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Image
                                    src={aboutImageMap.community}
                                    alt="커뮤티니 서비스"
                                    width={461}
                                    height={244}
                                    className="rounded-lg object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Logo 섹션 */}
            <motion.section
                className="py-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                variants={fadeInUp}
            >
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <motion.h2
                        className="text-head font-bold mb-4"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        Our Logo
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 text-h3 mb-12 max-w-3xl mx-auto"
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        전 세계에서 온 사람들이 손을 맞잡고 함께 정착을 돕는 글로벌 커뮤니티를 상징하며, <br />
                        주황색의 따뜻함과 파란색의 신뢰가 공존하는 HELPie의 브랜드 철학을 시각적으로 담고 있습니다.
                    </motion.p>
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Image src={aboutImageMap.draft} alt="draft" width={952} height={537} />
                    </motion.div>
                </div>
            </motion.section>

            {/* Our Character 섹션 */}
            <motion.section
                className="py-16 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                variants={fadeInUp}
            >
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <motion.h2
                        className="text-3xl font-bold mb-4"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        Our Character
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 text-h3 mb-12"
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        HELPie의 &apos;H&apos;에서 탄생한 에피와 치피는<br />
                        서로 다른 문화를 잇고, 함께 돕고 어울리는 글로벌 메이트를 상징합니다.
                    </motion.p>
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Image src={aboutImageMap.character} alt="캐릭터" width={952} height={537}/>
                    </motion.div>
                </div>
            </motion.section>
            </div>
        </div>
        </>
    );
}