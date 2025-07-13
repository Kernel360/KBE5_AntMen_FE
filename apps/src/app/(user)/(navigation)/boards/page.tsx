'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PostList } from '@/widgets/post/PostList';
import { NoticeSortOption, InquirySortOption } from '@/shared/types/board';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader';
import { BoardSearchBar } from '@/widgets/post/BoardSearchBar';
import { BoardTabs } from '@/widgets/post/BoardTabs';
import { BoardSortModal } from '@/widgets/post/BoardSortModal';

export default function BoardsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'공지사항' | '서비스 문의'>('공지사항');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<NoticeSortOption | InquirySortOption>('latest');

  // URL 파라미터에서 상태 초기화
  useEffect(() => {
    const tabCode = searchParams?.get('t');
    const search = searchParams?.get('search') || '';
    const sort = (searchParams?.get('sort') as NoticeSortOption | InquirySortOption) || 'latest';
    
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
    
    setSearchQuery(search);
    setSelectedSort(sort);
  }, [searchParams]);

  // 상태 변화 디버깅
  useEffect(() => {
    console.log('📊 상태 업데이트:', { activeTab, searchQuery, selectedSort });
  }, [activeTab, searchQuery, selectedSort]);

  // 초기 로드 시 URL 파라미터가 없으면 기본값으로 설정
  useEffect(() => {
    if (!searchParams?.toString()) {
      const defaultParams = new URLSearchParams();
      defaultParams.set('t', 'n');
      defaultParams.set('sort', 'latest');
      router.replace(`/boards?${defaultParams.toString()}`);
    }
  }, [searchParams, router]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateURL({ search: value });
  };

  const handleSortChange = (sort: NoticeSortOption | InquirySortOption) => {
    setSelectedSort(sort);
    updateURL({ sort });
  };

  const handleTabChange = (tab: '공지사항' | '서비스 문의' | '업무 문의') => {
    if (tab === '공지사항' || tab === '서비스 문의') {
      setActiveTab(tab);
      const tabCode = tab === '공지사항' ? 'n' : 'i';
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
    
    router.push(`/boards?${currentParams.toString()}`);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <CommonHeader
        title="게시판"
        showCloseButton={true}
      />

      <div className="pt-16 pb-20">
        <div className="sticky top-16 z-10 bg-white">
          <BoardSearchBar 
            onSearch={handleSearch}
            onFilterClick={() => setIsSortModalOpen(true)}
            searchTerm={searchQuery}
          />
          <BoardTabs
            userRole="customer"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="mx-auto w-full max-w-[430px]">
          <PostList 
            key={`${searchQuery}-${selectedSort}-${activeTab}`}
            userRole="customer"
            boardType={activeTab}
            searchTerm={searchQuery}
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
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