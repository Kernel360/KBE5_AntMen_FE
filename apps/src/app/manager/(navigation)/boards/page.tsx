'use client';

import { useState } from 'react';
import { BoardTabs } from '@/widgets/post/BoardTabs';
import { PostList } from '@/widgets/post/PostList';
import { BoardHeader } from '@/widgets/post/BoardHeader';
import { BoardSearchBar } from '@/widgets/post/BoardSearchBar';

export default function ManagerBoardsPage() {
  const [activeTab, setActiveTab] = useState<'공지사항' | '업무 문의'>('공지사항');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // TODO: 검색 로직 구현
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <BoardHeader />
      <BoardSearchBar 
        onSearch={handleSearch}
        onFilterClick={() => setIsSortModalOpen(true)}
      />
      <BoardTabs
        userRole="manager"
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
      />
      <PostList userRole="manager" boardType={activeTab} />
    </main>
  );
} 