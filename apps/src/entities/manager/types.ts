export interface Worker {
  id: string
  name: string
  rating: number
  experience: string
  age: number
  gender: string
  avatar: string
  phone: string
}

// 백엔드 ManagerStatus enum과 매핑
export type ManagerStatus = 'WAITING' | 'APPROVED' | 'REJECTED' | 'REAPPLY'

// 프론트엔드 화면 표시용 상태 (내부적으로 사용)
export type ManagerDisplayStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Manager {
  id: string
  name: string
  email: string
  phone: string
  status: ManagerStatus
  rejectionReason?: string
  approvedAt?: Date
  rejectedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ManagerStatusNotification {
  hasSeenApprovalNotification: boolean
  lastSeenApprovalAt?: Date
}
