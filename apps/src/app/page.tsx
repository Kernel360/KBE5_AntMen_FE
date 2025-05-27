'use client';

import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layouts/MainLayout';
import { HomeHeader } from '@/components/home/HomeHeader';
import { CategorySection } from '@/components/home/CategorySection';
import { NoticeSection } from '@/components/home/NoticeSection';
import { BottomNavigation } from '@/components/shared/BottomNavigation';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen bg-white">
        <HomeHeader />
        <CategorySection />
        <NoticeSection />
        <Link 
          href="/reservation" 
          className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[328px] h-14 bg-[#0fbcd6] text-white rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            className="stroke-2"
          >
            <path d="M2.5 4.16667H17.5V17.3333H2.5V4.16667Z" />
            <path d="M2.5 8.33333H17.5" />
            <path d="M6.66675 2.5V5.83333" />
            <path d="M13.3333 2.5V5.83333" />
          </svg>
          예약하기
        </Link>
        <BottomNavigation />
      </div>
    </MainLayout>
  );
} 