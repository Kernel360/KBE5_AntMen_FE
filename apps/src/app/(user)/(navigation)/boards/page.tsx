'use client';

import { useState } from 'react';
import { BoardHeader } from '@/widgets/post/BoardHeader';
import { BoardSearchBar } from '@/widgets/post/BoardSearchBar';
import { BoardTabs } from '@/widgets/post/BoardTabs';
import { BoardSortModal } from '@/widgets/post/BoardSortModal';
import { PostList } from '@/widgets/post/PostList';
import { BoardType, SortOption } from '@/shared/types/board';

export default function UserBoardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('latest');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'공지사항' | '서비스 문의'>('공지사항');

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
          userRole="customer"
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
        />
      </div>
      <div className="pb-[72px]">
        <div className="mx-auto w-full max-w-[430px]">
          <PostList 
            userRole="customer"
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