'use client'

import { HomeHeader } from '@/features/home/ui/HomeHeader'
import { CategorySection } from '@/features/home/ui/CategorySection'
import { NoticeSection } from '@/features/home/ui/NoticeSection'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-white">
      <HomeHeader
        title="앤트워커로 달라지는 일상"
        subtitle="바쁜 일상에서 손쉽게 맡겨보세요"
        buttonText="예약하기"
        onButtonClick={() => router.push('/reservation')}
        buttonIcon={<CalendarIcon className="w-6 h-6 text-black" />}
      />
      <CategorySection />
      <NoticeSection />
    </div>
  )
}
