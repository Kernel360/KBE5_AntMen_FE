'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MatchingFilterTab } from '@/entities/matching';
import { MatchingRequestResponse } from '@/entities/matching/model/types';

const tabs: { id: MatchingFilterTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'oneTime', label: '일회성' },
  { id: 'regular', label: '정기' },
];

// // 환경에 따라 baseUrl 분기
// const baseUrl =
//   process.env.NODE_ENV === 'production'
//     ? 'https://api.antmen.site'
//     : 'http://localhost:9092';

const ManagerMatchingPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MatchingFilterTab>('all');
  const [requests, setRequests] = useState<MatchingRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:9092/api/v1/manager/matching/list`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!res.ok) throw new Error('매칭 요청 목록을 불러오지 못했습니다');
        const data = await res.json();
        setRequests(data);
      } catch (e) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    // TODO: 분류 기준 필드가 확정되면 아래 조건을 수정하세요.
    // return request.reservation.categoryName === activeTab;
    return true; // 임시로 모든 요청을 표시
  });

  // 실제 수락/거절 API 연동
  // TODO: 매니저가 수락/거절하는 로직은 추후 개발 예정
  /*
  const handleAccept = async (matchingId: number) => {
    try {
      await fetch(`https://api.antmen.site:9092/api/v1/manager/matching/${matchingId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchingManagerIsAccept: true,
          matchingRefuseReason: '',
        }),
      });
      setRequests(prev =>
        prev.map(request =>
          request.matchings?.some(m => m.matchingId === matchingId)
            ? {
                ...request,
                reservationStatus: 'accepted',
                matchings: request.matchings.map(m =>
                  m.matchingId === matchingId
                    ? { ...m, isAccepted: true, isRequested: false }
                    : m
                ),
              }
            : request
        )
      );
    } catch (e) {
      alert('수락에 실패했습니다.');
    }
  };

  const handleReject = async (matchingId: number) => {
    const refuseReason = prompt('거절 사유를 입력하세요') || '';
    try {
      await fetch(`https://api.antmen.site:9092/api/v1/manager/matching/${matchingId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchingManagerIsAccept: false,
          matchingRefuseReason: refuseReason,
        }),
      });
      setRequests(prev =>
        prev.map(request =>
          request.matchings?.some(m => m.matchingId === matchingId)
            ? {
                ...request,
                reservationStatus: 'rejected',
                matchings: request.matchings.map(m =>
                  m.matchingId === matchingId
                    ? { ...m, isAccepted: false, isRequested: false, refuseReason }
                    : m
                ),
              }
            : request
        )
      );
    } catch (e) {
      alert('거절에 실패했습니다.');
    }
  };
  */

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
          {loading ? (
            <div className="text-center py-8 text-gray-400">불러오는 중...</div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              // TODO: 타입 에러 해결 후 아래 코드 활성화
              // <MatchingRequestCard
              //   key={request.reservation.reservationId}
              //   request={request.reservation}
              //   // onAccept/onReject 등은 주석 처리된 상태 유지
              // />
              <div key={Math.random()} className="border p-4 rounded bg-gray-50 text-gray-400 text-center">
                카드 렌더링 로직 타입 확정 필요
              </div>
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