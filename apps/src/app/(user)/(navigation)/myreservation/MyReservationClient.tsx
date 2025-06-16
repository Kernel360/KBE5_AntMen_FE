'use client'

import React, { useState, useEffect } from 'react'
import type { FC } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReservationCard } from '@/entities/reservation/ui/ReservationCard'
import type {
  Reservation,
  ReservationTab,
} from '@/entities/reservation/model/types'
import { CustomerAuthGuard } from '@/components/auth/CustomerAuthGuard'
import Cookies from 'js-cookie'

export const MyReservationClient: FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ReservationTab>('upcoming')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReservations()
  }, [])

  const getReservations = async (): Promise<void> => {
    try {
      let rawToken = Cookies.get('auth-token')?.trim() || ''
      if (rawToken.startsWith('Bearer ')) {
        rawToken = rawToken.slice(7)
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(rawToken && { Authorization: `Bearer ${rawToken}` }),
      }

      const res = await fetch(
        `https://api.antmen.site:9091/api/v1/customer/reservations`,
        {
          cache: 'no-store',
          method: 'GET',
          headers,
        },
      )

      if (!res.ok) throw new Error('Failed to fetch reservations')

      const data = await res.json()
      const normalized = normalizeReservations(data)
      setReservations(normalized)
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/myreservation/${id}`)
  }

  const handleNewReservation = () => {
    router.push('/reservation/form')
  }

  const filteredReservations = reservations.filter((r) => {
    const status = r.reservationStatus?.toUpperCase()
    return activeTab === 'upcoming'
      ? ['SCHEDULED', 'WAITING', 'MATCHING', 'PAY'].includes(status)
      : ['DONE', 'CANCEL', 'ERROR'].includes(status)
  })

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between p-5 bg-white">
        <button
          onClick={() => router.back()}
          className="flex h-6 w-6 items-center justify-center"
        >
          <Image
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            width={24}
            height={24}
          />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">예약 내역</h1>
        <div className="h-6 w-6" />
      </header>

      <div className="sticky top-[72px] z-20 bg-white">
        <div className="flex gap-10 px-5">
          <button
            onClick={() => setActiveTab('upcoming')}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`text-base ${activeTab === 'upcoming' ? 'font-extrabold text-[#0fbcd6]' : 'font-medium text-[#999999]'}`}
            >
              예정된 예약
            </span>
            {activeTab === 'upcoming' && (
              <div className="h-0.5 w-full bg-[#0fbcd6]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`text-base ${activeTab === 'past' ? 'font-extrabold text-[#0fbcd6]' : 'font-medium text-[#999999]'}`}
            >
              지난 예약
            </span>
            {activeTab === 'past' && (
              <div className="h-0.5 w-full bg-[#0fbcd6]" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredReservations.length > 0 ? (
          <div className="space-y-4 p-5">
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.reservationId}
                reservation={reservation}
                userType="customer"
                onViewDetails={() =>
                  handleViewDetails(String(reservation.reservationId))
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[500px] flex-col items-center justify-center gap-6 p-6">
            <div className="relative h-[120px] w-[120px]">
              <div className="absolute left-[10px] top-[10px] h-[100px] w-[100px] bg-[#BBBBBB]" />
              <div className="absolute left-[60px] top-[40px] h-[20px] w-[20px] rounded-full border-[6px] border-[#BBBBBB]" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-xl font-bold text-[#222222]">
                예약 내역이 없습니다
              </h2>
              <p className="text-center text-base text-[#AAAAAA]">
                아직 예약한 청소 서비스가 없습니다.
                <br />
                지금 서비스를 예약해보세요.
              </p>
            </div>
            <button
              onClick={handleNewReservation}
              className="mt-3 w-[280px] rounded-xl bg-[#0fbcd6] py-4 text-base font-bold text-white"
            >
              청소 서비스 예약하기
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function normalizeReservations(raw: any[]): Reservation[] {
  return raw.map((r) => ({
    reservationId: r.reservationId,
    customerId: r.customerId,
    reservationCreatedAt: r.reservationCreatedAt,
    reservationDate: r.reservationDate,
    reservationTime: r.reservationTime,
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    recommendDuration: r.recommendDuration,
    reservationDuration: r.reservationDuration,
    managerId: r.managerId,
    managerName: r.managerName,
    matchedAt: r.matchedAt,
    reservationStatus: r.reservationStatus,
    reservationCancelReason: r.reservationCancelReason,
    reservationMemo: r.reservationMemo,
    reservationAmount: r.reservationAmount,
    optionIds: r.optionIds,
    optionNames: r.optionNames,
    address: r.address,
  }))
}

export const MyReservationClientWithAuth: FC = () => (
  <CustomerAuthGuard>
    <MyReservationClient />
  </CustomerAuthGuard>
)

export default MyReservationClientWithAuth
