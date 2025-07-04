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

  // 탭 초기화 (URL 파라미터 우선, 없으면 기본값)
  useEffect(() => {
    const tabCode = searchParams?.get('t');
    
    if (tabCode) {
      // URL 파라미터가 있으면 적용
      const tabMap: Record<string, '공지사항' | '서비스 문의'> = {
        'n': '공지사항',
        'i': '서비스 문의'
      };
      const tab = tabMap[tabCode];
      if (tab) {
        setActiveTab(tab);
        return;
      }
    }
    // URL 파라미터가 없으면 기본값('공지사항') 유지
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // TODO: 검색 로직 구현
  };

  const handleSortChange = (sort: NoticeSortOption | InquirySortOption) => {
    setSelectedSort(sort);
    // TODO: 정렬 로직 구현
  };

  const handleTabChange = (tab: '공지사항' | '서비스 문의' | '업무 문의') => {
    if (tab === '공지사항' || tab === '서비스 문의') {
      setActiveTab(tab);
      // URL에 탭 정보 반영
      const tabCode = tab === '공지사항' ? 'n' : 'i';
      router.replace(`/boards?t=${tabCode}`);
    }
  };

  const handleClose = () => {
    // 이전 페이지로 이동
    router.back();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <CommonHeader
        title="게시판"
        showCloseButton={true}
        onClose={handleClose}
      />

      <div className="pt-16 pb-20">
        <div className="sticky top-16 z-10 bg-white">
          <BoardSearchBar 
            onSearch={handleSearch}
            onFilterClick={() => setIsSortModalOpen(true)}
          />
          <BoardTabs
            userRole="customer"
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="mx-auto w-full max-w-[430px]">
          <PostList 
            userRole="customer"
            boardType={(() => {
              // URL 파라미터를 직접 읽어서 탭 결정 (상태 비동기 문제 해결)
              const tabCode = searchParams?.get('t');
              if (tabCode === 'i') return '서비스 문의';
              if (tabCode === 'n') return '공지사항';
              return activeTab; // URL 파라미터가 없으면 상태값 사용
            })()}
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