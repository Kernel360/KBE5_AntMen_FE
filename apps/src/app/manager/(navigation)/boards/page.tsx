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

  // URL 파라미터에서 상태 초기화
  useEffect(() => {
    const search = searchParams?.get('search') || '';
    const sort = (searchParams?.get('sort') as SortOption) || 'latest';
    
    if (tabCode) {
      const tab = tabMap[tabCode as 'n' | 'w'];
      if (tab) {
        setActiveTab(tab as '공지사항' | '업무 문의');
        localStorage.setItem('managerBoardActiveTab', tab);
      }
    } else {
      const savedTab = localStorage.getItem('managerBoardActiveTab');
      if (savedTab === '공지사항' || savedTab === '업무 문의') {
        setActiveTab(savedTab as '공지사항' | '업무 문의');
      }
    }
    
    setSearchQuery(search);
    setSelectedSort(sort);
  }, [searchParams, tabCode, tabMap]);

  // 초기 로드 시 URL 파라미터가 없으면 기본값으로 설정
  useEffect(() => {
    if (!searchParams?.toString()) {
      const defaultParams = new URLSearchParams();
      defaultParams.set('t', 'n');
      defaultParams.set('sort', 'latest');
      router.replace(`/manager/boards?${defaultParams.toString()}`);
    }
  }, [searchParams, router]);

  useEffect(() => {
    localStorage.setItem('managerBoardActiveTab', activeTab);
  }, [activeTab]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateURL({ search: value });
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    updateURL({ sort });
  };

  const handleTabChange = (tab: '공지사항' | '서비스 문의' | '업무 문의') => {
    if (tab === '공지사항' || tab === '업무 문의') {
      setActiveTab(tab);
      const tabCode = tab === '공지사항' ? 'n' : 'w';
      updateURL({ t: tabCode });
    }
  };

  const updateURL = (params: Record<string, string>) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });
    
    router.push(`/manager/boards?${currentParams.toString()}`);
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
            searchTerm={searchQuery}
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
              key={`${searchQuery}-${selectedSort}-${activeTab}`}
              userRole="manager"
              boardType={activeTab}
              searchTerm={searchQuery}
              selectedSort={selectedSort}
              onSortChange={handleSortChange}
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