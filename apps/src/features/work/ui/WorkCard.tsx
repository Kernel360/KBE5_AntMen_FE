'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Work } from '@/entities/work';

interface WorkCardProps {
  work: Work;
  onCancel: (workId: string) => void;
}

export const WorkCard = ({ work, onCancel }: WorkCardProps) => {
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
    
    // 시간 형식 변환 (예: 10:00 -> 오전 10:00)
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? '오후' : '오전';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    
    return `${year}년 ${month}월 ${day}일 · ${period} ${displayHour}:${minutes}`;
  };

  return (
    <article className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      {/* 서비스 헤더 */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-black">
            {work.serviceName}
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
            <span className="text-sm text-gray-600">
              {work.location.district}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-xs font-medium ${getStatusColor(work.status)}`}>
          {getStatusLabel(work.status)}
        </div>
      </header>

      {/* 상세 정보 */}
      <section className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">
            날짜 및 시간
          </span>
          <span className="text-sm text-black">
            {formatDateTime(work.reservationDate, work.reservationTime)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">
            소요 시간
          </span>
          <span className="text-sm text-black">
            {work.duration}시간
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">
            고객
          </span>
          <span className="text-sm text-black">
            {work.customerName}
          </span>
        </div>
      </section>

      {/* 액션 버튼 */}
      <footer className="flex gap-3">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel(work.id);
          }}
          className="flex-1 h-11 border border-gray-300 rounded-[22px] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label={`${work.serviceName} 업무 취소`}
        >
          취소
        </button>
        <Link
          href={`/manager/work/${work.id}`}
          className="flex-1 h-11 bg-[#0fbcd6] rounded-[22px] text-sm font-bold text-white hover:bg-[#0ca8c0] transition-colors flex items-center justify-center"
          aria-label={`${work.serviceName} 업무 상세보기`}
        >
          상세보기
        </Link>
      </footer>
    </article>
  );
}; 