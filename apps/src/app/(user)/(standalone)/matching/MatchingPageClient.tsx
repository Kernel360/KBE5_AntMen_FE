'use client'

import { useEffect, useState } from 'react'
import { MatchingHeader, ManagerList, BottomSection } from '@/widgets/manager'
import { useManagerSelection } from '@/features/manager-selection'
import { getRecommendedManagers, type MatchingRequestDto } from '@/entities/matching'
import type { Manager } from '@/widgets/manager/model/manager'

// 매니저 매칭 알고리즘 함수 (추후 확장 가능)
function getMatchedManagers(managers: Manager[], count: number = 5): Manager[] {
  
  // return managers.slice(0, count)
  return managers // 임시: 전체 매니저 반환 (테스트용)
}

export default function MatchingPageClient() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { selectedManagers, handleManagerSelect } = useManagerSelection()

  useEffect(() => {
    async function fetchManagers() {
      try {
        // 세션에서 예약 정보 가져오기 (탭별로 분리)
        const reservationInfoStr = sessionStorage.getItem('currentReservation')
        if (!reservationInfoStr) {
          setIsLoading(false)
          return
        }

        const reservationInfo = JSON.parse(reservationInfoStr)

        // 매니저 목록 가져오기 - 알고리즘 API 함수 사용
        const matchingRequest: MatchingRequestDto = {
          reservationDate: reservationInfo.reservationDate,
          reservationTime: reservationInfo.reservationTime,
          reservationDuration: reservationInfo.reservationDuration,
          addressId: reservationInfo.addressId,
        }

        const data = await getRecommendedManagers(
          matchingRequest,
          true,        // useDistanceFilter
          'distance'   // sortType
        )

        // 데이터 구조 변환 - MatchingManagerListResponseDto에서 Manager로 변환
        const formattedManagers: Manager[] = Array.isArray(data)
          ? data.map((manager) => ({
              id: manager.managerId?.toString() || '',
              name: manager.managerName || '',
              gender: manager.managerGender || '미지정',
              age: manager.managerAge || 0,
              rating: manager.managerRating || 0,
              description: manager.managerComment || '성실하고 친절한 서비스를 제공합니다.',
              profileImage: manager.managerImage || (manager.managerName ? manager.managerName[0] : '매'),
              reviewCount: 0, // API 응답에 없음, 기본값 사용
              introduction: manager.managerComment || '안녕하세요! 성실하고 친절한 매니저입니다.',
              characteristics: [
                { id: '1', label: '친절해요', type: 'kind' as const },
                { id: '2', label: '시간 엄수', type: 'punctual' as const },
                { id: '3', label: '꼼꼼해요', type: 'thorough' as const },
              ],
              reviews: [],
            }))
          : []

        // 매니저 데이터를 예약 정보에 추가하여 세션에 저장
        const updatedReservationInfo = {
          ...reservationInfo,
          managers: data, // 원본 데이터 저장
        }
        sessionStorage.setItem('currentReservation', JSON.stringify(updatedReservationInfo))

        setManagers(formattedManagers)
      } catch (error) {
        console.error('매니저 목록 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchManagers()
  }, [])

  // 매칭된 매니저만 추출 (현재는 5명만)
  const matchedManagers = getMatchedManagers(managers, 5)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center">
        <div className="w-full max-w-[375px] min-h-screen flex flex-col bg-slate-50">
          <MatchingHeader selectedCount={0} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-slate-500">매니저 목록을 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-[375px] min-h-screen flex flex-col bg-slate-50">
        <MatchingHeader selectedCount={selectedManagers.length} />
        <ManagerList
          managers={matchedManagers}
          selectedManagers={selectedManagers}
          onManagerSelect={handleManagerSelect}
        />
        <BottomSection
          selectedManagers={selectedManagers}
          managers={matchedManagers}
        />
      </div>
    </div>
  )
}
