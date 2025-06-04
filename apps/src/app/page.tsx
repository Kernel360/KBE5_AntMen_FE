'use client';

import { useState } from 'react';
import { Header } from '@/widgets/header/Header';
import { PostTabs } from '@/widgets/tabs/PostTabs';
import { PostList } from '@/widgets/post/PostList';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'notice' | 'work'>('notice');

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-[88px]">
        <PostTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <PostList />
      </div>
    </main>
  );
} 