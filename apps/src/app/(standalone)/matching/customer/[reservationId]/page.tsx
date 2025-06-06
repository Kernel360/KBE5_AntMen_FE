// 매칭 상세 페이지: 선택한 매니저의 상세 정보, 예약 정보, 메시지, 추가 옵션을 확인하고 매칭을 수락/거절할 수 있는 페이지
// 매니저의 매칭 수락 후 사용자가 최종 수락/거절을 선택하는 페이지 -> 모달로 구현 
// 삭제해도 될 거 같은데 확인 필요

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IoChevronBack, IoEllipsisHorizontal } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';
import { IoMdHeart } from 'react-icons/io';
import { BiTimeFive } from 'react-icons/bi';
import { MdThumbUp } from 'react-icons/md';
import { MANAGER_LIST } from '@/constants/manager';
import type { IconType } from 'react-icons';

const DynamicIcon = ({ icon, ...props }: { icon: IconType } & { className?: string; size?: number }) => {
  const Component = icon as React.ComponentType<any>;
  return <Component {...props} />;
};

export default function ReservationDetailPage() {
  const params = useParams();
  const reservationId = typeof params?.reservationId === 'string' ? params.reservationId : '';
  // TODO: Fetch reservation data using reservationId
  // const reservation = await getReservationById(reservationId);
  // const manager = reservation.manager;
  
  // Temporary: Using mock data
  const manager = MANAGER_LIST[0]; // Replace with actual data fetching

  if (!manager) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">예약 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const getCharacteristicContent = (type: 'kind' | 'punctual' | 'thorough') => {
    switch (type) {
      case 'kind':
        return {
          icon: IoMdHeart,
          style: 'bg-blue-50 text-blue-700',
          color: 'text-blue-500'
        };
      case 'punctual':
        return {
          icon: BiTimeFive,
          style: 'bg-green-50 text-green-700',
          color: 'text-green-500'
        };
      case 'thorough':
        return {
          icon: MdThumbUp,
          style: 'bg-red-50 text-red-700',
          color: 'text-red-500'
        };
      default:
        return {
          icon: IoMdHeart,
          style: 'bg-blue-50 text-blue-700',
          color: 'text-blue-500'
        };
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[370px] min-h-screen flex flex-col relative">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <Link href="/matching" className="text-gray-800">
            <DynamicIcon icon={IoChevronBack} size={24} />
          </Link>
          <h1 className="text-lg font-medium">매칭 상세</h1>
          <button className="text-gray-800">
            <DynamicIcon icon={IoEllipsisHorizontal} size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-[140px]">
          {/* Profile Section */}
          <div className="px-4 py-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl mb-4">
                {manager.profileImage}
              </div>
              <h2 className="text-2xl font-bold mb-2">{manager.name} 매니저</h2>
              <p className="text-gray-600 mb-2">{manager.gender} · {manager.age}세 </p>
              <div className="flex items-center gap-1 mb-4">
                {Array(Math.floor(manager.rating)).fill(null).map((_, index) => (
                  <DynamicIcon key={index} icon={AiFillStar} className="text-yellow-400" size={20} />
                ))}
                {manager.rating % 1 > 0 && (
                  <DynamicIcon icon={AiFillStar} className="text-gray-300" size={20} />
                )}
                <span className="text-gray-600 ml-2">{manager.rating}점 (리뷰 {manager.reviewCount}개)</span>
              </div>
            </div>
          </div>

          {/* Reservation Details Section */}
          <section className="px-4 py-6 border-t">
            <h3 className="text-xl font-bold mb-4">예약 정보</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">날짜</span>
                <span className="font-medium">2024년 3월 15일</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">시간</span>
                <span className="font-medium">오후 2:00 - 4:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">위치</span>
                <span className="font-medium">서울시 강남구</span>
              </div>
            </div>
          </section>

          {/* Manager Message Section */}
          <section className="px-4 py-6 border-t">
            <h3 className="text-xl font-bold mb-4">매니저 메시지</h3>
            <p className="text-gray-700 leading-relaxed">
              안녕하세요! 매칭 요청 감사합니다. 고객님의 요구사항을 꼼꼼히 확인했습니다.
              최선을 다해 서비스를 제공하도록 하겠습니다.
            </p>
          </section>

          {/* Additional Options Section */}
          <section className="px-4 py-6 border-t">
            <h3 className="text-xl font-bold mb-4">추가 옵션</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">기본 서비스</span>
                <span className="font-medium">50,000원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">심화 청소</span>
                <span className="font-medium">+20,000원</span>
              </div>
              <div className="flex justify-between font-bold mt-4">
                <span>총 금액</span>
                <span>70,000원</span>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Buttons */}
        <div className="fixed bottom-0 w-full max-w-[370px] bg-white">
          <div className="px-4">
            <div className="border-t border-slate-200">
              <div className="py-4 flex gap-4">
                <button className="flex-1 h-14 rounded-2xl font-semibold text-primary text-lg border-2 border-primary">
                  거절하기
                </button>
                <button className="flex-1 h-14 rounded-2xl font-semibold text-white text-lg bg-primary">
                  매칭 수락
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 