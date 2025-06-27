import { ManagerStatus, ManagerDisplayStatus } from '../types'

/**
 * 백엔드 ManagerStatus를 프론트엔드 화면 표시용 상태로 변환
 */
export const mapManagerStatusToDisplay = (status: ManagerStatus): ManagerDisplayStatus => {
  switch (status) {
    case 'WAITING':
      return 'PENDING' // 승인 대기 화면
    case 'REAPPLY':
      return 'PENDING' // 재지원도 승인 대기 화면과 동일
    case 'APPROVED':
      return 'APPROVED' // 승인 완료 화면
    case 'REJECTED':
      return 'REJECTED' // 승인 거절 화면
    default:
      console.warn('알 수 없는 매니저 상태:', status)
      return 'PENDING' // 기본값: 승인 대기
  }
}

/**
 * 상태별 표시 텍스트 반환
 */
export const getManagerStatusText = (status: ManagerStatus): string => {
  switch (status) {
    case 'WAITING':
      return '승인 대기 중'
    case 'REAPPLY':
      return '재지원 검토 중'
    case 'APPROVED':
      return '승인 완료'
    case 'REJECTED':
      return '승인 거절'
    default:
      return '상태 확인 중'
  }
}

/**
 * 상태별 설명 텍스트 반환
 */
export const getManagerStatusDescription = (status: ManagerStatus): string => {
  switch (status) {
    case 'WAITING':
      return '매니저 가입 신청이 검토 중입니다.'
    case 'REAPPLY':
      return '재지원 신청이 검토 중입니다.'
    case 'APPROVED':
      return '축하합니다! 매니저로 승인되었습니다.'
    case 'REJECTED':
      return '안타깝게도 매니저 가입 신청이 거절되었습니다.'
    default:
      return '상태를 확인하고 있습니다.'
  }
} 