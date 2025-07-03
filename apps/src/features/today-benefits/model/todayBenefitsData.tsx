import { ReactNode } from 'react'
import { FaUser, FaPlaneDeparture, FaStar } from 'react-icons/fa'

export interface TodayBenefitItem {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  badge?: string;
  badgeColor?: string;
  bgColor?: string;
  className?: string;
  isLargeCard?: boolean;
}

export const todayBenefits: TodayBenefitItem[] = [
  // 이벤트 카드들 (120px 높이)
  {
    icon: (
      <div className="w-[88px] h-[88px] rounded-xl bg-[#b3e5fc] flex items-center justify-center">
        <FaPlaneDeparture className="text-[#4fc3f7] w-12 h-12" />
      </div>
    ),
    title: '앤트워크 이벤트',
    description: (
      <div className="text-sm">
        <div className="text-[#666666] font-medium mb-1">지금 서비스 예약하고</div>
        <div className="text-[#4ecdc4] font-bold text-lg">청소 혜택 받기</div>
      </div>
    ),
    bgColor: 'bg-[#e8f4fd]',
    isLargeCard: true
  },
  {
    icon: (
      <div className="w-[88px] h-[88px] rounded-xl bg-[#b3f5f1] flex items-center justify-center">
        <FaStar className="w-12 h-12 text-[#4fd1c7]" />
      </div>
    ),
    title: '혜택 추가',
    description: (
      <div className="text-sm">
        <div className="text-[#666666] font-medium mb-1">앤트워크에게 알려주세요</div>
        <div className="text-[#4ecdc4] font-bold text-lg">이용하고 싶은 서비스</div>
      </div>
    ),
    bgColor: 'bg-[#e8fdf8]',
    isLargeCard: true
  },
  {
    icon: (
      <div className="w-[88px] h-[88px] rounded-xl bg-[#ffe082] flex items-center justify-center">
        <FaUser className="w-12 h-12 text-[#fff4b3]" />
      </div>
    ),
    title: '앤트워크 혜택',
    description: (
      <div className="text-sm">
        <div className="text-[#666666] font-medium mb-1">사용한 서비스 리뷰 남기고</div>
        <div className="text-[#4ecdc4] font-bold text-lg">1,000P 받기</div>
      </div>
    ),  
    bgColor: 'bg-[#fff3c4]',
    isLargeCard: true
  }
]