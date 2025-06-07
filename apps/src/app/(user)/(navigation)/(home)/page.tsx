'use client';

import { HomeHeader } from '@/features/home/ui/HomeHeader';
import { CategorySection } from '@/features/home/ui/CategorySection';
import { NoticeSection } from '@/features/home/ui/NoticeSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HomeHeader />
      <CategorySection />
      <NoticeSection />
    </main>
  );
} 