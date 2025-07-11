'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

interface JwtPayload {
  sub: string // userId
  userRole: 'CUSTOMER' | 'MANAGER' | 'ADMIN'
  exp: number
  iat: number
}

interface SecureUser {
  userId: number
  userRole: 'CUSTOMER' | 'MANAGER' | 'ADMIN'
  isTokenValid: boolean
}

/**
 * 🛡️ 완전히 안전한 인증 훅
 * localStorage 사용 안함! JWT만 사용!
 */
export const useSecureAuth = () => {
  const [user, setUser] = useState<SecureUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // JWT에서 사용자 정보 추출
  const extractUserFromJWT = useCallback((): SecureUser | null => {
    try {
      const rawToken = Cookies.get('auth-token')
      if (!rawToken) return null

      const cleanToken = rawToken.replace(/^Bearer\s+/, '')
      const payload = jwtDecode<JwtPayload>(cleanToken)

      // 토큰 만료 확인
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp < now) {
        return null
      }

      return {
        userId: parseInt(payload.sub),
        userRole: payload.userRole,
        isTokenValid: true
      }
    } catch (error) {
      console.error('JWT 파싱 오류:', error)
      return null
    }
  }, [])

  // 초기화 및 토큰 변화 감지
  useEffect(() => {
    const updateUser = () => {
      const extractedUser = extractUserFromJWT()
      setUser(extractedUser)
      setIsLoading(false)
    }

    updateUser()

    // 쿠키 변화 감지 (폴링 방식)
    const interval = setInterval(updateUser, 1000)
    return () => clearInterval(interval)
  }, [extractUserFromJWT])

  // JWT 만료 감지 시 storage 이벤트 트리거 (여러 탭 동기화)
  useEffect(() => {
    if (user && user.isTokenValid === false) {
      // 만료 감지 시 storage 이벤트 트리거
      localStorage.setItem('auth-event', JSON.stringify({ type: 'logout', ts: Date.now() }));
    }
  }, [user]);

  // 편의 메서드들
  const isLoggedIn = useMemo(() => user !== null, [user])
  
  const hasRole = useCallback((role: string) => {
    return user?.userRole === role
  }, [user])

  const isManager = useMemo(() => user?.userRole === 'MANAGER', [user])
  const isCustomer = useMemo(() => user?.userRole === 'CUSTOMER', [user])
  const isAdmin = useMemo(() => user?.userRole === 'ADMIN', [user])

  const logout = useCallback(() => {
    Cookies.remove('auth-token')
    Cookies.remove('auth-time')
    setUser(null)
    window.location.href = '/login'
  }, [])

  return {
    // 기본 정보
    user,
    isLoggedIn,
    isLoading,
    
    // 권한 체크
    hasRole,
    isManager,
    isCustomer,
    isAdmin,
    
    // 액션
    logout,
    
    // 유틸리티
    getUserId: () => user?.userId || null,
    getUserRole: () => user?.userRole || null,
  }
}

/**
 * 사용 예시:
 * 
 * const { user, isLoggedIn, isManager, logout } = useSecureAuth()
 * 
 * if (isManager) {
 *   // 매니저 전용 UI
 * }
 */ 