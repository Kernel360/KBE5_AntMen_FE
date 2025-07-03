import { TodayBenefitsSection } from '@/features/today-benefits/ui/TodayBenefitsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '오늘의 혜택',
  description: '오늘 받을 수 있는 다양한 혜택을 확인하세요.'
}

const Page = () => (
  <main className="max-w-md mx-auto p-4 bg-white min-h-screen">
    <TodayBenefitsSection />
  </main>
)

export default Page