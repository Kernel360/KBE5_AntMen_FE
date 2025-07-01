'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Manager } from '@/widgets/manager/model/manager'
import { getAutoMatchingManagers, type MatchingRequestDto } from '@/entities/matching'

interface BottomSectionProps {
  selectedManagers: string[]
  reservationId?: string
  managers: Manager[]
}

export function BottomSection({
  selectedManagers,
  managers,
}: BottomSectionProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const getSelectedManagerNames = () => {
    if (selectedManagers.length === 0) return ''

    const names = selectedManagers
      .map((id) => {
        const manager = managers.find((m) => m.id === id)
        return manager ? manager.name : ''
      })
      .filter(Boolean)

    if (names.length === 0) return ''
    return `${names.join(', ')} 매니저가 선택되었습니다`
  }

  const handleNext = async () => {
    setIsLoading(true)

    try {
      // 세션에서 예약 정보 가져오기
      const reservationInfoStr = sessionStorage.getItem('currentReservation')
      
      if (!reservationInfoStr) {
        throw new Error(
          '예약 정보를 찾을 수 없습니다. 예약 과정을 다시 시작해 주세요.',
        )
      }

      const reservationInfo = JSON.parse(reservationInfoStr)
      let finalSelectedManagers = selectedManagers
      let selectedManagerDetails: any[] = []

      // 자동 매칭인 경우 (선택된 매니저가 없을 때)
      if (selectedManagers.length === 0) {
        
        const matchingRequest: MatchingRequestDto = {
          reservationDate: reservationInfo.reservationDate,
          reservationTime: reservationInfo.reservationTime,
          reservationDuration: reservationInfo.reservationDuration,
          addressId: reservationInfo.addressId,
        }

        // 자동 매칭 API 호출 (상위 3명 매니저 조회)
        const autoMatchedManagers = await getAutoMatchingManagers(matchingRequest)

        // 자동 매칭된 매니저들을 선택 목록에 추가
        finalSelectedManagers = autoMatchedManagers.map(manager => manager.managerId.toString())
        selectedManagerDetails = autoMatchedManagers.map(manager => ({
          id: manager.managerId.toString(),
          name: manager.managerName,
          gender: manager.managerGender,
          age: manager.managerAge,
          rating: manager.managerRating,
          description: manager.managerComment,
          image: manager.managerImage,
        }))

      } else {
        // 수동 선택인 경우
        selectedManagerDetails = selectedManagers
          .map((id) => {
            const manager = managers.find((m) => m.id === id)
            return manager
              ? {
                  id: manager.id,
                  name: manager.name,
                  gender: manager.gender,
                  age: manager.age,
                  rating: manager.rating,
                  description: manager.description,
                }
              : null
          })
          .filter(Boolean)
      }

      // 매니저 선택 정보를 예약 정보에 추가 (ID와 상세 정보 모두 저장)
      const updatedReservationInfo = {
        ...reservationInfo,
        selectedManagerIds: finalSelectedManagers, // ID 배열
        selectedManagers: selectedManagerDetails, // 상세 정보 배열
        isAutoMatching: selectedManagers.length === 0, // 자동 매칭 여부
      }

      // 세션에 업데이트된 정보 저장
      sessionStorage.setItem('currentReservation', JSON.stringify(updatedReservationInfo))

      // 예약 확인 페이지로 이동
      router.push('/reservation/confirm')
    } catch (error) {
      console.error('예약 정보 처리 오류:', error)
      alert(error instanceof Error ? error.message : '오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="px-4 pb-32" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 py-3 pb-safe bg-white z-50">
        {selectedManagers.length > 0 && (
          <div className="flex items-center gap-2 py-3">
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10">
              <span className="text-primary text-sm">i</span>
            </div>
            <span className="text-gray-800 rounded px-2 py-1 font-medium text-sm">
              {getSelectedManagerNames()}
            </span>
          </div>
        )}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="w-full h-14 rounded-2xl font-semibold text-black text-base bg-primary disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
        >
          {isLoading
            ? selectedManagers.length === 0
              ? '자동매칭 중...'
              : '처리 중...'
            : selectedManagers.length === 0
              ? '자동매칭 이용하기'
              : '다음'}
        </button>
      </div>
    </>
  )
}
