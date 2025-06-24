'use client'

import { HomeHeader } from '@/features/home/ui/HomeHeader'
import { NoticeSection } from '@/features/home/ui/NoticeSection'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { CategorySwiper } from '@/features/home/ui/category/CategorySwiper'
import { useEffect, useState } from 'react'
import { ReservationCard } from '@/entities/reservation/ui/ReservationCard'
import { getMyReservations } from '@/entities/reservation/api/reservationApi'
import type { Reservation } from '@/entities/reservation/model/types'

const isToday = (dateString: string) => {
  const today = new Date()
  const date = new Date(dateString)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const ManagerTodaySchedule = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 쿠키에서 토큰 추출
    const rawToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth-token='))
      ?.split('=')[1] || ''
    const decodedToken = decodeURIComponent(rawToken)
    const token = decodedToken.replace(/^Bearer\s+/, '')
    const authHeader = `Bearer ${token}`

    getMyReservations(authHeader)
      .then((data) => setReservations(data.filter(r => isToday(r.reservationDate))))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4">오늘의 일정을 불러오는 중...</div>
  if (reservations.length === 0) return <div className="p-4 text-gray-500">오늘 예정된 업무가 없습니다.</div>

  return (
    <section className="p-4">
      <h2 className="text-lg font-bold mb-3">오늘의 일정</h2>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.reservationId}
            reservation={reservation}
            userType="manager"
            onViewDetails={() => { /* 상세보기 이동 구현 */ }}
          />
        ))}
      </div>
    </section>
  )
}

export default function ManagerHomePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-white">
      <HomeHeader
        title="앤트워커로 달라지는 일상"
        subtitle="바쁜 일상에서 효율적으로 일해보세요"
        buttonText="급여 확인하기"
        onButtonClick={() => router.push('/manager/salary')}
        buttonIcon={<BanknotesIcon className="w-6 h-6 text-black" />}
      />
      <ManagerTodaySchedule />
      <NoticeSection />
    </main>
  )
}
