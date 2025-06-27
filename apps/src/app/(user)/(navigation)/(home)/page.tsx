'use client'

import { HomeHeader } from '@/features/home/ui/HomeHeader'
import { NoticeSection } from '@/features/home/ui/NoticeSection'
import { useRouter } from 'next/navigation'
import { CategorySwiper } from '@/features/home/ui/category/CategorySwiper'
import { EventBannerSwiper } from '@/features/home/ui/eventBanner/EventBannerSwiper'
import { ReservationStorage } from '@/shared/lib/reservationStorage'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  // 홈 페이지 접근 시 예약 정보 정리
  useEffect(() => {
    const clearReservationData = async () => {
      try {
        await ReservationStorage.clearPendingReservation()
        console.log('🏠 홈 페이지 접근 시 예약 정보 정리 완료')
      } catch (error) {
        console.error('홈 페이지에서 예약 정보 정리 실패:', error)
      }
    }

    clearReservationData()
  }, [])

  return (
    <div className="bg-white">
      <HomeHeader
        title="앤트워크로 달라지는 일상"
        subtitle="바쁜 일상에서 효율적으로 청소하세요"
        buttonText="예약하기"
        onButtonClick={() => router.push('/reservation')}
      />
      <NoticeSection />
    </div>
  )
}
