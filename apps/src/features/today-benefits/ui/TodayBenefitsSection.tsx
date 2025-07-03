'use client'

import { useRouter } from 'next/navigation'
import { todayBenefits } from '../model/todayBenefitsData';
import { TodayBenefitCard } from './TodayBenefitCard';

export const TodayBenefitsSection = () => {
  const router = useRouter()

  const getClickHandler = (index: number) => {
    const routes = ['/reservation', '/boards', '/reviews']
    
    return index < routes.length 
      ? () => router.push(routes[index])
      : undefined
  }

  return (
    <section aria-labelledby="today-benefits-title" className="px-5 py-4">
      {/* <h1 id="today-benefits-title" className="text-2xl font-bold mb-6 text-black">오늘의 혜택</h1> */}
      <div className="space-y-4">
        {todayBenefits.map((item, idx) => (
          <TodayBenefitCard 
            key={idx} 
            {...item} 
            onClick={getClickHandler(idx)}
          />
        ))}
      </div>
    </section>
  )
}