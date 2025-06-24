'use client'

import { HomeHeader } from '@/features/home/ui/HomeHeader'
import { NoticeSection } from '@/features/home/ui/NoticeSection'
import { useRouter } from 'next/navigation'
import { CategorySwiper } from '@/features/home/ui/category/CategorySwiper'
import { EventBannerSwiper } from '@/features/home/ui/eventBanner/EventBannerSwiper'

export default function Home() {
  const router = useRouter()

  return (
    <div className="bg-white">
      <HomeHeader
        title="앤트워커로 달라지는 일상"
        subtitle="바쁜 일상에서 효율적으로 청소하세요"
        buttonText="예약하기"
        onButtonClick={() => router.push('/reservation')}
      />
      <NoticeSection />
    </div>
  )
}
