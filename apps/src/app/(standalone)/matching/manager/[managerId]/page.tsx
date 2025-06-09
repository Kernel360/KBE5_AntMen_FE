// 매니저 상세 페이지

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { MANAGER_LIST, type Manager } from '@/widgets/manager/model/manager';
import { ManagerDetailLoading } from '@/widgets/manager';

export default function ManagerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const managerId = params?.managerId as string;
  
  const [manager, setManager] = useState<Manager | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 매니저 상세 데이터 로딩 시뮬레이션
    const loadManagerDetail = async () => {
      try {
        // 실제 API 호출 시:
        // const response = await fetch(`/api/managers/${managerId}`);
        // const data = await response.json();
        
        // 현재는 상수 데이터에서 찾기
        await new Promise(resolve => setTimeout(resolve, 600));
        const foundManager = MANAGER_LIST.find(m => m.id === managerId);
        setManager(foundManager || null);
        setIsLoading(false);
      } catch (error) {
        console.error('매니저 정보 로딩 실패:', error);
        setManager(null);
        setIsLoading(false);
      }
    };

    if (managerId) {
      loadManagerDetail();
    }
  }, [managerId]);

  if (isLoading) {
    return <ManagerDetailLoading />;
  }
  
  if (!manager) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">매니저를 찾을 수 없습니다</h2>
          <button 
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarIconOutline key={i} className="w-5 h-5 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const getCharacteristicColor = (type: string) => {
    switch (type) {
      case 'kind':
        return 'bg-blue-100 text-blue-600';
      case 'punctual':
        return 'bg-green-100 text-green-600';
      case 'thorough':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[420px] mx-auto">
        {/* 헤더 */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600"
          >
            <ChevronLeftIcon className="w-6 h-6" />
            <span className="text-base font-medium">목록으로 돌아가기</span>
          </button>
          <button className="p-1">
            <EllipsisHorizontalIcon className="w-6 h-6 text-slate-600" />
          </button>
        </header>

        {/* 프로필 섹션 */}
        <section className="px-5 py-8 text-center border-b border-gray-100">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-slate-600">{manager.profileImage}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{manager.name} 매니저</h1>
          <p className="text-slate-500 mb-4">{manager.gender} · {manager.age}세</p>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(manager.rating)}
            </div>
            <span className="text-lg font-semibold text-slate-800">{manager.rating}점</span>
          </div>
          <p className="text-sm text-slate-500">(리뷰 {manager.reviewCount}개)</p>
        </section>

        {/* 자기소개 */}
        <section className="px-5 py-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">자기소개</h2>
          <p className="text-slate-700 leading-relaxed">{manager.introduction}</p>
        </section>

        {/* 성격 특징 */}
        <section className="px-5 py-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">성격 특징</h2>
          <div className="flex flex-wrap gap-3">
            {manager.characteristics.map((char) => (
              <span
                key={char.id}
                className={`px-4 py-2 rounded-full text-sm font-medium ${getCharacteristicColor(char.type)}`}
              >
                {char.label}
              </span>
            ))}
          </div>
        </section>

        {/* 고객 리뷰 */}
        <section className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">고객 리뷰</h2>
            <button
              onClick={() => router.push(`/matching/manager/${managerId}/reviews`)}
              className="text-primary text-sm font-medium">
              전체보기 &gt;
            </button>
          </div>
          
          <div className="space-y-4">
            {manager.reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-800">{review.userName}</span>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-2">{review.content}</p>
                <p className="text-xs text-slate-500">{review.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 버튼 */}
        <div className="px-5 py-6 border-t border-gray-100">
          <button 
            onClick={() => router.back()}
            className="w-full py-4 bg-white border border-gray-300 rounded-lg font-medium text-slate-700 hover:bg-gray-50 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
} 