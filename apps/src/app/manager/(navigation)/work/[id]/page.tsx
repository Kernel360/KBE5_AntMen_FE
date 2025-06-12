'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Work } from '@/entities/work';
import { notFound } from 'next/navigation';

interface WorkDetailPageProps {
  params: {
    id: string;
  };
}

// 임시 목업 데이터 - 실제로는 API에서 가져올 데이터
const getWorkDetail = async (id: string): Promise<Work | null> => {
  // 실제로는 API 호출
  await new Promise(resolve => setTimeout(resolve, 100)); // 로딩 시뮬레이션
  
  const mockData: { [key: string]: Work } = {
    '1': {
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
      // 상세 정보
      reservationId: 'W240615001',
      address: '서울시 강남구 테헤란로 123 아파트 101동 1001호',
      customerPhone: '010-1234-5678',
      amount: 60000,
      memo: '반려동물이 있어서 주의해서 청소 부탁드립니다.',
      requirements: ['반려동물 주의', '친환경 세제 사용']
    },
    '2': {
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
      reservationId: 'W240622002',
      address: '서울시 서초구 강남대로 456 빌딩 5층',
      customerPhone: '010-2345-6789',
      amount: 80000,
      memo: '정기적으로 매주 청소 예정입니다.',
      requirements: ['정기 청소', '사무용품 정리']
    },
    '3': {
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
      reservationId: 'W240605003',
      address: '서울시 송파구 올림픽로 789 아파트 201동 502호',
      customerPhone: '010-3456-7890',
      amount: 45000,
      memo: '화장실과 주방 위주로 청소 부탁드립니다.',
      requirements: ['화장실 청소', '주방 청소']
    },
    '4': {
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
      reservationId: 'W240611004',
      address: '서울시 강동구 천호대로 321 빌라 3층',
      customerPhone: '010-4567-8901',
      amount: 75000,
      memo: '큰 집이라 시간이 많이 걸릴 수 있습니다.',
      requirements: ['전체 청소', '창문 청소']
    },
    '5': {
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
      reservationId: 'W240612005',
      address: '서울시 마포구 월드컵북로 654 아파트 103동 801호',
      customerPhone: '010-5678-9012',
      amount: 120000,
      memo: '이사 후 입주 전 청소입니다.',
      requirements: ['이사 후 청소', '완전 청소']
    }
  };
  
  return mockData[id] || null;
};

export default function WorkDetailPage({ params }: WorkDetailPageProps) {
  const [work, setWork] = React.useState<Work | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWork = async () => {
      const workData = await getWorkDetail(params.id);
      setWork(workData);
      setLoading(false);
    };
    fetchWork();
  }, [params.id]);

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (!work) {
    notFound();
  }

  const getStatusLabel = (status: Work['status']) => {
    switch (status) {
      case 'scheduled':
        return '예정됨';
      case 'in_progress':
        return '진행중';
      case 'completed':
        return '완료됨';
      case 'cancelled':
        return '취소됨';
      default:
        return '알 수 없음';
    }
  };

  const getStatusColor = (status: Work['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-[#E8F0FE] text-[#0fbcd6]';
      case 'in_progress':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'completed':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'cancelled':
        return 'bg-[#FEE2E2] text-[#DC2626]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? '오후' : '오전';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    
    return `${year}년 ${month}월 ${day}일 · ${period} ${displayHour}:${minutes}`;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/manager/work"
            className="w-6 h-6 relative"
            aria-label="업무 목록으로 돌아가기"
          >
            <Image
              src="/icons/arrow-left.svg"
              alt="뒤로가기"
              fill
              className="object-contain"
            />
          </Link>
          <h1 className="text-lg font-bold text-black">업무 상세</h1>
          <div className="w-6 h-6" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </header>

      {/* 본문 */}
      <main className="p-5 space-y-5">
        {/* 업무 기본 정보 */}
        <section className="bg-white rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">
              {work.serviceName}
            </h2>
            <div className={`px-3 py-1.5 rounded-xl text-xs font-medium ${getStatusColor(work.status)}`}>
              {getStatusLabel(work.status)}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">예약 번호</span>
              <span className="text-sm text-black">{work.reservationId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">날짜 및 시간</span>
              <span className="text-sm text-black">
                {formatDateTime(work.reservationDate, work.reservationTime)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">소요 시간</span>
              <span className="text-sm text-black">
                {work.duration}시간
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">주소</span>
              <span className="text-sm text-black text-right max-w-[200px]">
                {work.address || work.location.district}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">급여</span>
              <span className="text-sm font-bold text-[#0fbcd6]">
                {work.amount ? formatAmount(work.amount) : '-'}
              </span>
            </div>
          </div>
        </section>

        {/* 고객 정보 */}
        <section className="bg-white rounded-xl p-5 space-y-4">
          <h3 className="text-lg font-bold text-black">고객 정보</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">고객명</span>
              <span className="text-sm text-black">{work.customerName}</span>
            </div>
            {work.customerPhone && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">연락처</span>
                <span className="text-sm text-black">{work.customerPhone}</span>
              </div>
            )}
          </div>
        </section>

        {/* 특이사항 */}
        {work.memo && (
          <section className="bg-white rounded-xl p-5 space-y-4">
            <h3 className="text-lg font-bold text-black">특이사항</h3>
            <p className="text-sm text-black leading-relaxed">
              {work.memo}
            </p>
          </section>
        )}

        {/* 요구사항 */}
        {work.requirements && work.requirements.length > 0 && (
          <section className="bg-white rounded-xl p-5 space-y-4">
            <h3 className="text-lg font-bold text-black">요구사항</h3>
            <div className="space-y-2">
              {work.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0fbcd6] rounded-full" />
                  <span className="text-sm text-black">{requirement}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
} 