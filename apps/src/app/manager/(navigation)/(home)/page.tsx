'use client'

import { HomeHeader } from '@/features/home/ui/HomeHeader'
import { BanknotesIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ReservationCard } from '@/entities/reservation/ui/ReservationCard'
import { getMyReservations, checkIn, checkOut } from '@/entities/reservation/api/reservationApi'
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
  const [processingId, setProcessingId] = useState<string | null>(null)
  const router = useRouter()

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

  const handleCheckIn = async (id: string) => {
    setProcessingId(id)
    try {
      // 쿠키에서 토큰 추출
      const rawToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))
        ?.split('=')[1] || ''
      const decodedToken = decodeURIComponent(rawToken)
      const token = decodedToken.replace(/^Bearer\s+/, '')
      const authHeader = `Bearer ${token}`
      await checkIn(Number(id), new Date().toISOString(), authHeader)
      setReservations((prev) => prev.map(r => r.reservationId.toString() === id ? { ...r, checkinAt: new Date().toISOString() } : r))
    } finally {
      setProcessingId(null)
    }
  }

  const handleCheckOut = async (id: string) => {
    setProcessingId(id)
    try {
      // 쿠키에서 토큰 추출
      const rawToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))
        ?.split('=')[1] || ''
      const decodedToken = decodeURIComponent(rawToken)
      const token = decodedToken.replace(/^Bearer\s+/, '')
      const authHeader = `Bearer ${token}`
      await checkOut(Number(id), { checkoutAt: new Date().toISOString(), comment: '' }, authHeader)
      setReservations((prev) => prev.map(r => r.reservationId.toString() === id ? { ...r, checkoutAt: new Date().toISOString() } : r))
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <section className="px-4 pt-6">
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <CalendarIcon className="w-6 h-6 text-primary" />
        오늘의 일정
      </h2>
      {loading ? (
        <div className="py-8 text-center text-gray-400">오늘의 일정을 불러오는 중...</div>
      ) : reservations.length === 0 ? (
        <div className="py-8 text-center text-gray-400">오늘 예정된 업무가 없습니다.</div>
      ) : (
        <ul className="space-y-4">
          {reservations.map((reservation) => (
            <li key={reservation.reservationId}>
              <ReservationCard
                reservation={reservation}
                userType="manager"
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onViewDetails={() => router.push(`/manager/reservations/${reservation.reservationId}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function ManagerHomePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-white">
      <div className="relative">
        <HomeHeader
          title="앤트워커로 달라지는 일상"
          subtitle="바쁜 일상에서 효율적으로 일해보세요"
          buttonText="급여 확인하기"
          onButtonClick={() => router.push('/manager/salary')}
          buttonIcon={<BanknotesIcon className="w-6 h-6 text-black" />}
        />
      </div>
      <ManagerTodaySchedule />
    </main>
  )
}