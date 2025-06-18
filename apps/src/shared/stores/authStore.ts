import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { UserData } from '@/entities/user/model/types'

export type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN'

interface User {
  userId: number | null
  userRole: UserRole | null
}

interface AuthState {
  isLoggedIn: boolean
  user: User
  token: string | null
  userData: UserData | null
}

interface AuthActions {
  login: (user: User, token: string) => void
  logout: () => void
  setToken: (token: string | null) => void
  setUserData: (data: UserData | null) => void
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: {
    userId: null,
    userRole: null,
  },
  token: null,
  userData: null,
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
    })),
    {
      name: 'auth-storage', // storage-key
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
