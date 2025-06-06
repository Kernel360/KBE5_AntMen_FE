'use client';

import { useState } from 'react';
import { BoardTabs } from '@/widgets/post/BoardTabs';
import { PostList } from '@/widgets/post/PostList';
import { BoardHeader } from '@/widgets/post/BoardHeader';
import { BoardSearchBar } from '@/widgets/post/BoardSearchBar';
import { BoardSortModal } from '@/widgets/post/BoardSortModal';
import { SortOption } from '@/shared/types/board';

export default function ManagerBoardsPage() {
  const [activeTab, setActiveTab] = useState<'공지사항' | '업무 문의'>('공지사항');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('latest');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // TODO: 검색 로직 구현
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    // TODO: 정렬 로직 구현
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
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
      </div>
      <div className="pb-[72px]">
        <div className="mx-auto w-full max-w-[430px]">
          <PostList 
            userRole="manager"
            boardType={activeTab}
          />
        </div>
      </div>
      <BoardSortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        boardType={activeTab}
      />
    </main>
  );
} 