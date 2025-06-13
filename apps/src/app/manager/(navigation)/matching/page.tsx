'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MatchingRequest, MatchingFilterTab } from '@/entities/matching';
import { MatchingRequestCard } from '@/features/matching';

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
  const [requests, setRequests] = useState<MatchingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.antmen.site:9092/api/v1/manager/matching/list`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
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
    return request.type === activeTab;
  });

  // 실제 수락/거절 API 연동은 아래 함수에 추가
  const handleAccept = async (reservationId: string) => {
    // await fetch(`${baseUrl}/api/v1/manager/matching/accept`, { method: 'POST', ... });
    setRequests(prev => 
      prev.map(request => 
        request.reservationId === reservationId 
          ? { ...request, reservationStatus: 'accepted' }
          : request
      )
    );
  };

  const handleReject = async (reservationId: string) => {
    // await fetch(`${baseUrl}/api/v1/manager/matching/reject`, { method: 'POST', ... });
    setRequests(prev => 
      prev.map(request => 
        request.reservationId === reservationId 
          ? { ...request, reservationStatus: 'rejected' }
          : request
      )
    );
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
          {loading ? (
            <div className="text-center py-8 text-gray-400">불러오는 중...</div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <MatchingRequestCard
                key={request.reservationId}
                request={request}
                onAccept={() => request.reservationId && handleAccept(request.reservationId)}
                onReject={() => request.reservationId && handleReject(request.reservationId)}
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