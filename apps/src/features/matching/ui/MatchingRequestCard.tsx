'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MatchingRequest } from '@/entities/matching';
import { useRouter } from 'next/navigation';

interface MatchingRequestCardProps {
  request: MatchingRequest;
  onAccept: () => void;
  onReject: () => void;
  isProcessing?: boolean;
}

export const MatchingRequestCard = ({ 
  request, 
  onAccept, 
  onReject,
  isProcessing = false,
}: MatchingRequestCardProps) => {
  const router = useRouter();

  const formatPayment = (amount: number) => {
    return `₩${amount.toLocaleString()}`;
  };

  const getTypeLabel = (type: string) => {
    return type === 'oneTime' ? '일회성' : '정기';
  };

  const formatDateTime = (date: string, time: string) => {
    // 날짜를 더 읽기 쉬운 형태로 변환
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    
    // 요일 계산
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[dateObj.getDay()];
    
    return `${year}년 ${month}월 ${day}일 (${weekday}) • ${time}`;
  };

  const formatDuration = (duration: number, additional: number) => {
    const total = duration + additional;
    return `${total}시간`;
  };

  return (
    <Link href={`/manager/matching/${request.id}`} className="block">
      <article className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-black text-black mb-1">
              {request.categoryName}
            </h3>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 relative">
                <Image
                  src="/icons/location.svg"
                  alt="위치"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs text-gray-600">
                {request.location.district}
              </span>
            </div>
          </div>
          <div className="bg-[#E8F0FE] px-2 py-1 rounded-2xl">
            <span className="text-xs font-medium text-[#0fbcd6]">
              {getTypeLabel(request.type)}
            </span>
          </div>
        </header>

        {/* 구분선 */}
        <div className="h-px bg-gray-200 mb-3" />

        {/* 상세 정보 */}
        <section className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-800 flex-1">
              날짜 및 시간
            </span>
            <span className="text-sm text-black">
              {formatDateTime(request.reservationDate, request.reservationTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-800 flex-1">
              소요 시간
            </span>
            <span className="text-sm text-black">
              {formatDuration(request.reservationDuration, request.additionalDuration)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-800 flex-1">
              급여
            </span>
            <span className="text-sm font-bold text-[#0fbcd6]">
              {formatPayment(request.reservationAmount)}
            </span>
          </div>
        </section>

        {/* 액션 버튼 */}
        <footer 
          className="flex gap-2"
          onClick={(e) => e.preventDefault()} // 링크 클릭 방지
        >
          <button
            onClick={(e) => {
              e.preventDefault(); // 링크 클릭 방지
              e.stopPropagation(); // 이벤트 버블링 방지
              onReject();
            }}
            disabled={isProcessing}
            className="flex-1 h-10 border border-gray-300 rounded-2xl text-sm font-black text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label={`${request.categoryName} 매칭 요청 거절`}
          >
            거절
          </button>
          <button
            onClick={(e) => {
              e.preventDefault(); // 링크 클릭 방지
              e.stopPropagation(); // 이벤트 버블링 방지
              onAccept();
            }}
            disabled={isProcessing}
            className="flex-1 h-10 bg-[#0fbcd6] rounded-2xl text-sm font-black text-white hover:bg-[#0ca8c0] transition-colors"
            aria-label={`${request.categoryName} 매칭 요청 수락`}
          >
            수락
          </button>
        </footer>
      </article>
    </Link>
  );
}; 