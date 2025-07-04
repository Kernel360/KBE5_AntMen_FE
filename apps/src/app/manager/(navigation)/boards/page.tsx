'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BoardTabs } from '@/widgets/post/BoardTabs';
import { PostList } from '@/widgets/post/PostList';
import { BoardHeader } from '@/widgets/post/BoardHeader';
import { BoardSearchBar } from '@/widgets/post/BoardSearchBar';
import { BoardSortModal } from '@/widgets/post/BoardSortModal';
import { SortOption } from '@/shared/types/board';

export default function ManagerBoardsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'공지사항' | '업무 문의'>('공지사항');
  const [searchQuery , setSearchQuery] = useState('');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('latest');

  // URL 쿼리와 매핑
  const tabMap = useMemo(() => ({ n: '공지사항', w: '업무 문의' }), []);
  const tabCode = searchParams?.get('t');
  const expectedTab = tabMap[tabCode as 'n' | 'w'] ?? '공지사항';

  // 탭 초기화 (URL 파라미터 우선, 없으면 localStorage, 그것도 없으면 기본값)
  useEffect(() => {
    if (tabCode) {
      const tab = tabMap[tabCode as 'n' | 'w'];
      if (tab) {
        setActiveTab(tab as '공지사항' | '업무 문의');
        localStorage.setItem('managerBoardActiveTab', tab);
        return;
      }
    }
    const savedTab = localStorage.getItem('managerBoardActiveTab');
    if (savedTab === '공지사항' || savedTab === '업무 문의') {
      setActiveTab(savedTab as '공지사항' | '업무 문의');
    }
  }, [searchParams, tabCode, tabMap]);

  useEffect(() => {
    localStorage.setItem('managerBoardActiveTab', activeTab);
  }, [activeTab]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
  };

  const handleTabChange = (tab: '공지사항' | '서비스 문의' | '업무 문의') => {
    if (tab === '공지사항' || tab === '업무 문의') {
      setActiveTab(tab);
      const tabCode = tab === '공지사항' ? 'n' : 'w';
      router.replace(`/manager/boards?t=${tabCode}`);
    }
  };

  const handleClose = () => {
    // 홈으로 직접 이동
    router.push('/manager')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <BoardHeader />
      <div className="pt-16 pb-20">
        <div className="sticky top-16 z-10 bg-white">
          <BoardSearchBar 
            onSearch={handleSearch}
            onFilterClick={() => setIsSortModalOpen(true)}
          />
          <BoardTabs
            userRole="manager"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
        <div className="mx-auto w-full max-w-[430px]">
          {/* PostList를 activeTab이 expectedTab과 일치할 때만 렌더링 */}
          {activeTab === expectedTab ? (
            <PostList 
              userRole="manager"
              boardType={activeTab}
            />
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400">로딩 중...</div>
          )}
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