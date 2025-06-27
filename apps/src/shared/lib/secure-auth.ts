import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

interface JwtPayload {
  sub: string // userId
  userRole: string
  exp: number
  iat: number
}

/**
 * 🛡️ 안전한 방식: JWT에서만 사용자 정보 추출
 * localStorage 사용 안함!
 */
export const secureAuth = {
  /**
   * JWT에서 사용자 정보 추출 (매번 파싱)
   */
  getCurrentUser: (): { userId: number; userRole: string } | null => {
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
        userRole: payload.userRole
      }
    } catch (error) {
      console.error('JWT 파싱 오류:', error)
      return null
    }
  },

  /**
   * 사용자 권한 확인
   */
  hasRole: (requiredRole: string): boolean => {
    const user = secureAuth.getCurrentUser()
    return user?.userRole === requiredRole
  },

  /**
   * 매니저 권한 확인
   */
  isManager: (): boolean => {
    return secureAuth.hasRole('MANAGER')
  },

  /**
   * 현재 사용자 ID
   */
  getUserId: (): number | null => {
    const user = secureAuth.getCurrentUser()
    return user?.userId || null
  }
}

/**
 * 🔥 기존 localStorage 방식 (취약함)
 */
export const insecureAuth = {
  getCurrentUser: () => {
    const stored = localStorage.getItem('auth-storage')
    if (!stored) return null
    
    const parsed = JSON.parse(stored)
    return parsed.state?.user || parsed.user // 🚨 조작 가능!
  }
}

/**
 * 사용 예시:
 * 
 * // ❌ 기존 방식 (취약)
 * const user = useAuthStore(state => state.user) // localStorage 기반
 * 
 * // ✅ 안전한 방식
 * const user = secureAuth.getCurrentUser() // JWT 기반
 */ 