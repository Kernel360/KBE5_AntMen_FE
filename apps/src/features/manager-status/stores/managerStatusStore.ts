import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ManagerStatus, ManagerStatusNotification } from '@/entities/manager/types'

interface ManagerStatusState {
  managerStatus: ManagerStatus | null
  hasSeenApprovalNotification: boolean
  lastSeenApprovalAt: Date | null
  
  // Actions
  setManagerStatus: (status: ManagerStatus) => void
  markApprovalNotificationAsSeen: () => void
  shouldShowApprovalNotification: () => boolean
  reset: () => void
}

// 사용자별 상태 관리를 위한 스토어 팩토리
export const createManagerStatusStore = (userId: string) => create<ManagerStatusState>()(
  persist(
    (set, get) => ({
      managerStatus: null,
      hasSeenApprovalNotification: false,
      lastSeenApprovalAt: null,

      setManagerStatus: (status: ManagerStatus) => {
        set({ managerStatus: status })
      },

      markApprovalNotificationAsSeen: () => {
        set({ 
          hasSeenApprovalNotification: true,
          lastSeenApprovalAt: new Date()
        })
      },

      shouldShowApprovalNotification: () => {
        const { managerStatus, hasSeenApprovalNotification } = get()
        // 승인 완료 상태이고, 아직 알림을 보지 않았다면 표시
        return managerStatus === 'APPROVED' && !hasSeenApprovalNotification
      },

      reset: () => {
        set({
          managerStatus: null,
          hasSeenApprovalNotification: false,
          lastSeenApprovalAt: null
        })
      }
    }),
    {
      name: `manager-status-storage-${userId}`,
      partialize: (state) => ({
        managerStatus: state.managerStatus,
        hasSeenApprovalNotification: state.hasSeenApprovalNotification,
        lastSeenApprovalAt: state.lastSeenApprovalAt
      })
    }
  )
)

// 스토어 인스턴스 관리
const storeInstances = new Map<string, ReturnType<typeof createManagerStatusStore>>()

export const useManagerStatusStore = (userId: string | null) => {
  if (!userId) {
    // 비로그인 사용자용 기본 스토어
    if (!storeInstances.has('anonymous')) {
      storeInstances.set('anonymous', createManagerStatusStore('anonymous'))
    }
    return storeInstances.get('anonymous')!()
  }

  // 사용자별 스토어 인스턴스 관리
  if (!storeInstances.has(userId)) {
    storeInstances.set(userId, createManagerStatusStore(userId))
  }
  
  return storeInstances.get(userId)!()
}

// 사용자 변경 시 스토어 정리
export const clearManagerStatusStore = (userId: string | null) => {
  const key = userId || 'anonymous'
  const store = storeInstances.get(key)
  if (store) {
    store.getState().reset()
    storeInstances.delete(key)
    // localStorage에서도 제거
    localStorage.removeItem(`manager-status-storage-${key}`)
  }
} 