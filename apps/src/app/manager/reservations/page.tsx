/**
 * 매니저 예약 내역 페이지
 * 업무 내역 페이지
 *
 * 평소(scheduled): "Check-in" 버튼 표시
 * 작업 시작 후(in-progress): "Check-out" 버튼 표시
 * 작업 완료 후(completed-pending-review): 보라색 "후기 작성" 버튼
 * 후기 작성 완료(completed): 회색 비활성화 "완료됨" 버튼
 *
 * TODO
 * 1. 예약 상세보기 페이지 추가
 * 2. 피그마 매칭 요청 검토 페이지 사용 여부 결정
 */
import { Suspense } from 'react'
import type { Reservation } from '@/entities/reservation/model/types'
import { ManagerReservationsClient } from './ManagerReservationsClient'
import { cookies } from 'next/headers'
import { PageSkeleton } from './loading'

async function getReservations(): Promise<Reservation[]> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    const res = await fetch('https://api.antmen.site:9091/api/v1/manager/reservations', {
      headers: {
        Authorization: token ?? '',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error('Failed to fetch reservations')
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return []
  }
}

export const dynamic = 'force-dynamic'

export default async function ManagerReservationsPage() {
  const initialReservations = await getReservations()

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ManagerReservationsClient initialReservations={initialReservations} />
    </Suspense>
  )
}
