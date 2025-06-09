/**
 * 매칭 확인
 * 
 * 예약 폼 -> 매니저 선택 -> 예약 확인 페이지
 * 
 * TODO
 * 매니저 리스트에서 선택한 데이터 전송받기
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  MoreHorizontal,
  Check,
  Star,
  Calendar,
  Plus,
} from 'lucide-react';
import ConfirmationView from './ConfirmationView';

interface MatchingConfirmationPageProps {
  params: {
    reservationId: string;
  };
}

// 타입 정의
interface Manager {
  id: string;
  name: string;
  rating: number;
  experience: string;
  age: number;
  gender: string;
  avatar: string;
  description: string;
  status: string;
}

interface Option {
  id: string;
  name: string;
  price: number;
}

// 헤더 컴포넌트
const MatchingHeader = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <header className="bg-white border-b border-slate-200 px-5 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="flex items-center justify-center w-6 h-6"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        
        <div className="flex-1 ml-3">
          <h1 className="text-xl font-bold text-slate-900">매칭 확인</h1>
          <p className="text-sm text-slate-600">매니저가 매칭을 요청했습니다</p>
        </div>
        
        <button className="flex items-center justify-center w-6 h-6">
          <MoreHorizontal className="w-6 h-6 text-slate-600" />
        </button>
      </div>
    </header>
  );
};

// 매니저 카드 컴포넌트
const ManagerCards = ({ managers }: { managers: Manager[] }) => {
  return (
    <div className="space-y-4">
      {managers.map((manager) => (
        <div
          key={manager.id}
          className="bg-white border-2 border-emerald-500 rounded-xl p-5"
        >
          {/* 매칭 요청 배지 */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex items-center px-3 py-1.5 bg-emerald-500 rounded-2xl">
              <Check className="w-3.5 h-3.5 text-white mr-1" />
              <span className="text-sm font-semibold text-white">매칭 요청</span>
            </div>
          </div>
          
          {/* 매니저 정보 */}
          <div className="flex items-start space-x-4">
            {/* 프로필 이미지 */}
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-slate-600">{manager.avatar}</span>
            </div>
            
            {/* 매니저 상세 정보 */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-slate-900">{manager.name} 매니저</h3>
              </div>
              
              <p className="text-sm text-slate-600 mb-2">
                {manager.gender} · {manager.age}세 · {manager.experience}
              </p>
              
              <div className="flex items-center mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm font-medium text-slate-600">{manager.rating}</span>
              </div>
              
              <p className="text-sm text-slate-700 leading-relaxed">
                {manager.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 예약 정보 요약 컴포넌트
const ReservationSummary = ({ reservation }: {
  reservation: {
    service: string;
    duration: string;
    date: string;
    time: string;
    location: string;
    floor: string;
  };
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      {/* 헤더 */}
      <div className="flex items-center mb-4">
        <Calendar className="w-5 h-5 text-slate-600 mr-3" />
        <h2 className="text-base font-semibold text-slate-900">예약 정보</h2>
      </div>
      
      {/* 예약 상세 정보 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-medium text-slate-700">{reservation.service}</span>
          <span className="text-sm text-slate-600">{reservation.duration}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-medium text-slate-700">{reservation.date}</span>
          <span className="text-sm text-slate-600">{reservation.time}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-medium text-slate-700">{reservation.location}</span>
          <span className="text-sm text-slate-600">{reservation.floor}</span>
        </div>
      </div>
    </div>
  );
};

// 옵션 요약 컴포넌트
const OptionsSummary = ({ options, totalAmount }: { options: Option[]; totalAmount: number }) => {
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      {/* 헤더 */}
      <div className="flex items-center mb-4">
        <Plus className="w-5 h-5 text-slate-600 mr-3" />
        <h2 className="text-base font-semibold text-slate-900">유료 옵션</h2>
      </div>
      
      {/* 옵션 리스트 */}
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-slate-700">{option.name}</span>
            <span className="text-sm font-semibold text-blue-600">+{formatCurrency(option.price)}</span>
          </div>
        ))}
        
        {/* 구분선 */}
        <div className="w-full h-px bg-slate-200 my-4"></div>
        
        {/* 총 금액 */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-900">총 금액</span>
          <span className="text-base font-bold text-slate-900">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

// 액션 버튼 컴포넌트
const MatchingActions = ({ matchingId }: { matchingId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleReject = async () => {
    if (confirm('정말로 매칭을 거절하시겠습니까?')) {
      setIsLoading(true);
      try {
        // API 호출 로직
        console.log('매칭 거절:', matchingId);
        // await rejectMatching(matchingId);
        
        // 매칭 페이지로 돌아가기
        router.push('/matching');
      } catch (error) {
        console.error('매칭 거절 실패:', error);
        alert('매칭 거절 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      // API 호출 로직
      console.log('매칭 수락:', matchingId);
      // await acceptMatching(matchingId);
      
      // 예약 완료 페이지로 이동
      router.push(`/reservation/${matchingId}/complete`);
    } catch (error) {
      console.error('매칭 수락 실패:', error);
      alert('매칭 수락 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 px-5 py-6">
      <div className="flex space-x-3">
        <button
          onClick={handleReject}
          disabled={isLoading}
          className="flex-1 h-[52px] bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          <span className="text-base font-semibold text-slate-700">
            {isLoading ? '처리 중...' : '거절'}
          </span>
        </button>
        
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className="flex-1 h-[52px] bg-[#4abed9] rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          <span className="text-base font-semibold text-white">
            {isLoading ? '처리 중...' : '매칭 수락'}
          </span>
        </button>
      </div>
    </div>
  );
};

// 임시 매칭 확인 데이터
const mockMatchingData = {
  id: 'CL-20230510-1234',
  status: '매칭 요청',
  managers: [
    {
      id: 'manager-1',
      name: '김민지',
      rating: 4.8,
      experience: '5년 경력',
      age: 28,
      gender: '여성',
      avatar: '김',
      description: '고객 만족도가 높으며 세심한 서비스를 제공합니다.',
      status: '매칭 요청'
    },
    {
      id: 'manager-2', 
      name: '이수진',
      rating: 4.9,
      experience: '3년 경력',
      age: 25,
      gender: '여성',
      avatar: '이',
      description: '꼼꼼하고 친절한 서비스로 많은 고객들이 재예약합니다.',
      status: '매칭 요청'
    }
  ],
  reservation: {
    service: '기본 청소',
    duration: '4시간',
    date: '2024.02.15 (목)',
    time: '10:00 ~ 14:00',
    location: '서울시 강남구 역삼동',
    floor: '3층'
  },
  options: [
    {
      id: 'option-1',
      name: '냉장고 청소',
      price: 15000
    },
    {
      id: 'option-2',
      name: '오븐 청소', 
      price: 10000
    }
  ],
  totalAmount: 85000
};

export default function MatchingConfirmationPage({ params }: MatchingConfirmationPageProps) {
  const matchingData = mockMatchingData; // 실제로는 params.reservationId를 사용해서 API에서 데이터 가져오기

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-[375px] min-h-screen flex flex-col bg-slate-50">
        <MatchingHeader />
        
        <div className="flex-1 px-5 py-5 space-y-5">
          <ManagerCards managers={matchingData.managers} />
          
          <ReservationSummary reservation={matchingData.reservation} />
          
          <OptionsSummary 
            options={matchingData.options}
            totalAmount={matchingData.totalAmount}
          />
        </div>
        
        <MatchingActions matchingId={matchingData.id} />
      </div>
    </div>
  );
} 