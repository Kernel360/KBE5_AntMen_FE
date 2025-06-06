import { useState } from 'react'
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
} from '@/features/auth/lib/auth'

export function useAuth() {
  // 초기값을 localStorage에서 불러옴
  const [token, setTokenState] = useState<string | null>(getAuthToken())

  const login = (newToken: string) => {
    setTokenState(newToken)
    setAuthToken(newToken) // localStorage에 저장
  }

  const logout = () => {
    setTokenState(null)
    removeAuthToken() // localStorage에서 삭제
  }

  return {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  }
}
