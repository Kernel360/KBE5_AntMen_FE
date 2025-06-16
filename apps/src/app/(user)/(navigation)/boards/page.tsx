'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostList } from '@/widgets/post/PostList';
import { BoardType, NoticeSortOption, InquirySortOption } from '@/shared/types/board';
import { BoardHeader } from '@/widgets/post/BoardHeader';
import { BoardSearchBar } from '@/widgets/post/BoardSearchBar';
import { BoardTabs } from '@/widgets/post/BoardTabs';
import { BoardSortModal } from '@/widgets/post/BoardSortModal';

export default function BoardsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'공지사항' | '서비스 문의'>('공지사항');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<NoticeSortOption | InquirySortOption>('latest');

  // 초기 로드 시 localStorage에서 저장된 탭 정보 불러오기
  useEffect(() => {
    const savedTab = localStorage.getItem('userBoardActiveTab');
    if (savedTab === '공지사항' || savedTab === '서비스 문의') {
      setActiveTab(savedTab);
    }
  }, []);

  // URL 파라미터에서 이전 탭 정보를 확인하고 적용
  useEffect(() => {
    const tabCode = searchParams?.get('t');
    if (tabCode) {
      const tabMap: Record<string, '공지사항' | '서비스 문의'> = {
        'n': '공지사항',
        'i': '서비스 문의'
      };
      const tab = tabMap[tabCode];
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, [searchParams]);

  // 탭이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('userBoardActiveTab', activeTab);
  }, [activeTab]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // TODO: 검색 로직 구현
  };

  const handleSortChange = (sort: NoticeSortOption | InquirySortOption) => {
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
          onTabChange={(tab) => {
            if (tab === '공지사항' || tab === '서비스 문의') {
              setActiveTab(tab);
            }
          }}
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

      {/* 정렬 모달 */}
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