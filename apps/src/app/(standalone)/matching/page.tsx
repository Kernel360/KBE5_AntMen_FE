/**
 * 최초 예약 폼 페이지
 *
 * reservationid가 발급되지 않은 상태에서 매니저 선택 페이지
 * 매칭 매니저 선택 후 id 발급
 */
import {
  MatchingHeader,
  ManagerList,
  BottomSection,
  ManagerListLoading,
} from '@/widgets/manager'
import { useManagerSelection } from '@/features/manager-selection'
import MatchingPageClient from './MatchingPageClient'
import { notFound } from 'next/navigation'

// 서버에서 매니저 리스트를 가져오는 함수
async function getAvailableManagers(reservationInfo: any) {
  if (!reservationInfo?.reservationDate || !reservationInfo?.reservationTime || !reservationInfo?.reservationDuration) {
    throw new Error('예약 정보가 없습니다.');
  }

  try {
    const response = await fetch('http://localhost:9091/api/v1/matching', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservationDate: reservationInfo.reservationDate,
        reservationTime: reservationInfo.reservationTime,
        reservationDuration: reservationInfo.reservationDuration,
        location: {
          district: reservationInfo.addressId
        }
      }),
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`매니저 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('매니저 목록 로딩 실패:', error);
    throw error;
  }
}

export default async function MatchingPage() {
  return <MatchingPageClient />;
}
