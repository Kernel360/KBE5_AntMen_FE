import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { UserData } from '@/entities/user/model/types'

export type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN'

interface User {
  userId: number | null
  userRole: UserRole | null
  id: number
  name: string
  email: string
  role: 'CUSTOMER' | 'MANAGER'
  profileImage?: string
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
  login: (user: User, token: string) => void
  logout: () => void
  setToken: (token: string | null) => void
  setUserData: (data: UserData | null) => void
  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setMatchingRequestCount: (count: number) => void
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

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      login: (user, token) => {
        set((state) => {
          state.isLoggedIn = true
          state.user = user
          state.token = token
        })
      },
      logout: () => {
        set((state) => {
          Object.assign(state, initialState)
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
      setMatchingRequestCount: (count) => set({ matchingRequestCount: count }),
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
