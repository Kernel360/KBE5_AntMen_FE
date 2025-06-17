'use client'

import { HomeHeader } from '@/features/home/ui/HomeHeader'
import { NoticeSection } from '@/features/home/ui/NoticeSection'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { CategorySwiper } from '@/features/home/ui/category/CategorySwiper'

export default function ManagerHomePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-white">
      <HomeHeader
        title="앤트워커로 달라지는 일상"
        subtitle="바쁜 일상에서 효율적으로 일해보아요"
        buttonText="급여 확인하기"
        onButtonClick={() => router.push('/manager/salary')}
        buttonIcon={<BanknotesIcon className="w-6 h-6 text-black" />}
      />
      <CategorySwiper />
      <NoticeSection />
    </main>
  )
}
