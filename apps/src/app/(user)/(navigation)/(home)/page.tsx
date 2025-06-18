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
      <HomeHeader />
      <NoticeSection />
    </div>
  )
}
