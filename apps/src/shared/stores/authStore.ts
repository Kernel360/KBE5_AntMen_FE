import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { UserData } from '@/entities/user/model/types'

export type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN'

interface User {
  userId: number | null
  userRole: UserRole | null
}

interface AuthLoginPayload {
  userId: number
  userRole: UserRole
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
  token: string | null
  userData: UserData | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  matchingRequestCount: number
}

interface AuthActions {
  login: (authUser: AuthLoginPayload, token: string) => void
  logout: () => void
  setToken: (token: string | null) => void
  setUserData: (data: UserData | null) => void
  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setMatchingRequestCount: (count: number) => void
  fetchMatchingRequestCount: () => Promise<void>
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  userData: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  matchingRequestCount: 0,
}

// 매칭 요청 개수를 가져오는 API 함수 (동적 import로 순환 참조 방지)
const getMatchingRequestCount = async (): Promise<number> => {
  try {
    const { getMatchingRequests } = await import('@/entities/matching/api/matchingAPi')
    const data = await getMatchingRequests(0, 1)
    return data.totalElements || 0
  } catch (error) {
    console.error('매칭 요청 개수 가져오기 실패:', error)
    return 0
  }
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      login: async (authUser, token) => {
        set((state) => {
          state.isLoggedIn = true
          state.user = {
            userId: authUser.userId,
            userRole: authUser.userRole,
          }
          state.token = token
        })
        
        // 매니저로 로그인한 경우 즉시 매칭 요청 개수 가져오기
        if (authUser.userRole === 'MANAGER') {
          try {
            const count = await getMatchingRequestCount()
            set((state) => {
              state.matchingRequestCount = count
            })
            console.log('✅ 로그인 시 매칭 요청 개수 설정:', count)
          } catch (error) {
            console.error('❌ 로그인 시 매칭 요청 개수 가져오기 실패:', error)
            set((state) => {
              state.matchingRequestCount = 0
            })
          }
        } else {
          // 매니저가 아닌 경우 0으로 설정
          set((state) => {
            state.matchingRequestCount = 0
          })
        }
      },
      logout: () => {
        set((state) => {
          Object.assign(state, {
            ...initialState,
            matchingRequestCount: 0,
          })
        })
      },
      setToken: (token) => {
        set((state) => {
          state.token = token
        })
      },
      setUserData: (data) => {
        set((state) => {
          state.userData = data
        })
      },
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      clearAuth: () =>
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null,
          matchingRequestCount: 0,
        }),
      setLoading: (isLoading) => set({ isLoading }),
      setMatchingRequestCount: (count) => set({ matchingRequestCount: typeof count === 'number' && count >= 0 ? count : 0 }),
      fetchMatchingRequestCount: async () => {
        const { user } = get()
        if (user?.userRole === 'MANAGER') {
          try {
            const count = await getMatchingRequestCount()
            set((state) => {
              state.matchingRequestCount = count
            })
          } catch (error) {
            console.error('매칭 요청 개수 가져오기 실패:', error)
            set((state) => {
              state.matchingRequestCount = 0
            })
          }
        }
      },
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        matchingRequestCount: state.matchingRequestCount,
      }),
    },
  ),
)
