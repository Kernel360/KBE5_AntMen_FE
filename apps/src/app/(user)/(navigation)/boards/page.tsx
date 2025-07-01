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

  // 탭 초기화 (URL 파라미터 우선, 없으면 localStorage, 그것도 없으면 기본값)
  useEffect(() => {
    const tabCode = searchParams?.get('t');
    const savedTab = localStorage.getItem('userBoardActiveTab');
    
    console.log('🔍 탭 초기화 디버깅:', {
      urlTabCode: tabCode,
      savedTab,
      currentActiveTab: activeTab
    });
    
    if (tabCode) {
      // URL 파라미터가 있으면 우선 적용
      const tabMap: Record<string, '공지사항' | '서비스 문의'> = {
        'n': '공지사항',
        'i': '서비스 문의'
      };
      const tab = tabMap[tabCode];
      if (tab) {
        console.log('✅ URL 파라미터로 탭 설정:', tab);
        setActiveTab(tab);
        localStorage.setItem('userBoardActiveTab', tab); // localStorage도 업데이트
        return;
      } else {
        console.log('⚠️ 알 수 없는 탭 코드:', tabCode);
      }
    }
    
    // URL 파라미터가 없으면 localStorage 확인
    if (savedTab === '공지사항' || savedTab === '서비스 문의') {
      console.log('✅ localStorage로 탭 설정:', savedTab);
      setActiveTab(savedTab);
    } else {
      console.log('✅ 기본값으로 탭 설정: 공지사항');
    }
    // 둘 다 없으면 기본값('공지사항') 유지
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

  const handleTabChange = (tab: '공지사항' | '서비스 문의' | '업무 문의') => {
    if (tab === '공지사항' || tab === '서비스 문의') {
      setActiveTab(tab);
      // URL에 탭 정보 반영
      const tabCode = tab === '공지사항' ? 'n' : 'i';
      router.replace(`/boards?t=${tabCode}`);
    }
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