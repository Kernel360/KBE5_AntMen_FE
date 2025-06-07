'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Work, WorkFilterTab } from '@/entities/work';
import { WorkCard } from '@/features/work';

// 목업 데이터 - 실제로는 API에서 가져올 데이터
const mockWorkData: Work[] = [
  {
    id: '1',
    serviceName: '가사 청소',
    reservationDate: '2025-07-09',
    reservationTime: '10:00',
    duration: 3,
    location: {
      district: '서울시 강남구'
    },
    customerName: '김민준',
    status: 'scheduled',
    // 상세페이지용 추가 정보
    reservationId: 'W240615001',
    amount: 60000,
    memo: '반려동물이 있어서 주의해서 청소 부탁드립니다.',
    requirements: ['반려동물 주의', '친환경 세제 사용']
  },
  {
    id: '2',
    serviceName: '사무실 청소',
    reservationDate: '2025-07-09',
    reservationTime: '14:00',
    duration: 3,
    location: {
      district: '서울시 서초구'
    },
    customerName: '김지훈',
    status: 'scheduled',
    // 상세페이지용 추가 정보
    reservationId: 'W240622002',
    amount: 80000,
    memo: '정기적으로 매주 청소 예정입니다.',
    requirements: ['정기 청소', '사무용품 정리']
  },
  {
    id: '3',
    serviceName: '부분 청소',
    reservationDate: '2025-08-10',
    reservationTime: '14:00',
    duration: 2,
    location: {
      district: '서울시 송파구'
    },
    customerName: '이서연',
    status: 'scheduled',
    // 상세페이지용 추가 정보
    reservationId: 'W240605003',
    amount: 45000,
    memo: '화장실과 주방 위주로 청소 부탁드립니다.',
    requirements: ['화장실 청소', '주방 청소']
  },
  {
    id: '4',
    serviceName: '정기 청소',
    reservationDate: '2025-08-11',
    reservationTime: '11:00',
    duration: 4,
    location: {
      district: '서울시 강동구'
    },
    customerName: '박준호',
    status: 'scheduled',
    // 상세페이지용 추가 정보
    reservationId: 'W240611004',
    amount: 75000,
    memo: '큰 집이라 시간이 많이 걸릴 수 있습니다.',
    requirements: ['전체 청소', '창문 청소']
  },
  {
    id: '5',
    serviceName: '이사 청소',
    reservationDate: '2025-08-12',
    reservationTime: '09:00',
    duration: 5,
    location: {
      district: '서울시 마포구'
    },
    customerName: '최영희',
    status: 'scheduled',
    // 상세페이지용 추가 정보
    reservationId: 'W240612005',
    amount: 120000,
    memo: '이사 후 입주 전 청소입니다.',
    requirements: ['이사 후 청소', '완전 청소']
  }
];

const tabs: { id: WorkFilterTab; label: string }[] = [
  { id: 'today', label: '오늘의 업무' },
  { id: 'scheduled', label: '예정된 업무' }
];

const ManagerWorkPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<WorkFilterTab>('scheduled');
  const [works, setWorks] = useState<Work[]>(mockWorkData);

  const filteredWorks = works.filter(work => {
    const today = new Date().toISOString().split('T')[0];
    
    if (activeTab === 'today') {
      return work.reservationDate === today;
    } else {
      return work.reservationDate >= today;
    }
  });

  const handleCancel = (workId: string) => {
    // 실제로는 API 호출
    setWorks(prev => 
      prev.map(work => 
        work.id === workId 
          ? { ...work, status: 'cancelled' as const }
          : work
      )
    );
    // TODO: 성공 토스트 메시지 표시
    console.log(`업무 ${workId} 취소됨`);
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
        <h1 className="flex-1 text-center text-2xl font-bold">업무 내역</h1>
        <div className="h-6 w-6" /> {/* 정렬을 위한 공간 */}
      </header>

      {/* 콘텐츠 */}
      <div className="px-5 pb-6">
        {/* 필터 탭 */}
        <section className="mb-4" role="tablist" aria-label="업무 필터">
          <div className="flex gap-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className={`text-base ${
                    activeTab === tab.id
                      ? 'font-extrabold text-[#0fbcd6]'
                      : 'font-medium text-[#999999]'
                  }`}
                >
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div className="h-0.5 w-full bg-[#0fbcd6]" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 업무 목록 */}
        <section 
          className="space-y-6"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          id={`panel-${activeTab}`}
        >
          {filteredWorks.length > 0 ? (
            filteredWorks.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                onCancel={handleCancel}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {activeTab === 'today' 
                  ? '오늘의 업무가 없습니다' 
                  : '예정된 업무가 없습니다'
                }
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ManagerWorkPage; 