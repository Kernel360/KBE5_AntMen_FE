'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MatchingRequest, MatchingFilterTab } from '@/entities/matching';
import { MatchingRequestCard } from '@/features/matching';

// 목업 데이터 - 실제로는 API에서 가져올 데이터
const mockMatchingRequests: MatchingRequest[] = [
  {
    id: '1',
    categoryName: '대청소',
    reservationDate: '2024-03-15',
    reservationTime: '10:00',
    reservationDuration: 2,
    additionalDuration: 1,
    reservationAmount: 60000,
    location: {
      district: '서울시 강남구'
    },
    type: 'oneTime',
    status: 'pending',
    // 상세페이지용 추가 정보
    reservationId: 'R240315001',
    reservationMemo: '반려동물이 있어서 알레르기 유발 요소가 없는 세제 사용 부탁드립니다.',
    optionNames: ['냉장고 청소', '화장실 청소'],
    priority: 1
  },
  {
    id: '2',
    categoryName: '사무실 청소',
    reservationDate: '2024-03-20',
    reservationTime: '18:00',
    reservationDuration: 2,
    additionalDuration: 0,
    reservationAmount: 45000,
    location: {
      district: '서울시 송파구'
    },
    type: 'regular',
    status: 'pending',
    // 상세페이지용 추가 정보
    reservationId: 'R240314002',
    reservationMemo: '매주 수요일마다 정기적으로 청소 부탁드립니다.',
    priority: 2
  },
  {
    id: '3',
    categoryName: '부분 청소',
    reservationDate: '2024-03-18',
    reservationTime: '14:00',
    reservationDuration: 3,
    additionalDuration: 1,
    reservationAmount: 80000,
    location: {
      district: '서울시 마포구'
    },
    type: 'oneTime',
    status: 'pending',
    // 상세페이지용 추가 정보
    reservationId: 'R240318003',
    reservationMemo: '이사 온지 얼마 안 되어서 먼지가 많이 쌓여있습니다.',
    optionNames: ['냉장고 청소', '베란다 청소'],
    priority: 1
  }
];

const tabs: { id: MatchingFilterTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'oneTime', label: '일회성' },
  { id: 'regular', label: '정기' }
];

const ManagerMatchingPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MatchingFilterTab>('all');
  const [requests, setRequests] = useState<MatchingRequest[]>(mockMatchingRequests);

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    return request.type === activeTab;
  });

  const handleAccept = (requestId: string) => {
    // 실제로는 API 호출
    setRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'accepted' as const }
          : request
      )
    );
    // TODO: 성공 토스트 메시지 표시
    console.log(`매칭 요청 ${requestId} 수락됨`);
  };

  const handleReject = (requestId: string) => {
    // 실제로는 API 호출
    setRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected' as const }
          : request
      )
    );
    // TODO: 성공 토스트 메시지 표시
    console.log(`매칭 요청 ${requestId} 거절됨`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-5">
        <button onClick={handleBack} className="flex h-6 w-6 items-center justify-center">
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">매칭 요청</h1>
        <div className="h-6 w-6" /> {/* 정렬을 위한 공간 */}
      </header>

      {/* 콘텐츠 */}
      <div className="p-4">
        {/* 필터 탭 */}
        <section className="flex gap-2 mb-4" role="tablist" aria-label="매칭 요청 필터">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 h-9 rounded-2xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#E8F0FE] text-[#0fbcd6]'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        {/* 매칭 요청 목록 */}
        <section 
          className="space-y-4"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          id={`panel-${activeTab}`}
        >
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <MatchingRequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {activeTab === 'all' 
                  ? '매칭 요청이 없습니다' 
                  : `${tabs.find(t => t.id === activeTab)?.label} 매칭 요청이 없습니다`
                }
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ManagerMatchingPage; 