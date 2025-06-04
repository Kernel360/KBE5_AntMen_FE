'use client';

import { HomeHeader } from '@/features/home/ui/HomeHeader';
import { CategorySection } from '@/features/home/ui/CategorySection';
import { NoticeSection } from '@/features/home/ui/NoticeSection';


export default function Home() {

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeHeader />
      <CategorySection />
      <NoticeSection />
    </main>
  );
} 