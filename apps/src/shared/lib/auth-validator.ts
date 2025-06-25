import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

interface JwtPayload {
  sub: string // userId
  userRole: string
  exp: number
  iat: number
}

interface StoredUser {
  userId: number | null
  userRole: string | null
}

/**
 * JWT 토큰과 localStorage의 사용자 정보가 일치하는지 검증
 */
export const validateAuthConsistency = (): {
  isValid: boolean
  tokenUser: JwtPayload | null
  storedUser: StoredUser | null
  error?: string
} => {
  try {
    // 1. 쿠키에서 토큰 가져오기
    const rawToken = Cookies.get('auth-token')
    if (!rawToken) {
      return {
        isValid: false,
        tokenUser: null,
        storedUser: null,
        error: '토큰이 없습니다'
      }
    }

    // 2. 토큰 디코딩
    const cleanToken = rawToken.replace(/^Bearer\s+/, '')
    const tokenUser = jwtDecode<JwtPayload>(cleanToken)

    // 3. localStorage에서 사용자 정보 가져오기
    const authStorage = localStorage.getItem('auth-storage')
    if (!authStorage) {
      return {
        isValid: false,
        tokenUser,
        storedUser: null,
        error: 'localStorage에 인증 정보가 없습니다'
      }
    }

    const parsedStorage = JSON.parse(authStorage)
    const storedUser: StoredUser = parsedStorage.state?.user || parsedStorage.user

    if (!storedUser) {
      return {
        isValid: false,
        tokenUser,
        storedUser: null,
        error: '저장된 사용자 정보가 없습니다'
      }
    }

    // 4. 토큰과 저장된 정보 비교
    const isUserIdMatch = parseInt(tokenUser.sub) === storedUser.userId
    const isRoleMatch = tokenUser.userRole === storedUser.userRole

    if (!isUserIdMatch || !isRoleMatch) {
      return {
        isValid: false,
        tokenUser,
        storedUser,
        error: '토큰과 저장된 정보가 일치하지 않습니다'
      }
    }

    // 5. 토큰 만료 확인
    const now = Math.floor(Date.now() / 1000)
    if (tokenUser.exp < now) {
      return {
        isValid: false,
        tokenUser,
        storedUser,
        error: '토큰이 만료되었습니다'
      }
    }

    return {
      isValid: true,
      tokenUser,
      storedUser
    }

  } catch (error) {
    return {
      isValid: false,
      tokenUser: null,
      storedUser: null,
      error: `검증 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    }
  }
}

/**
 * 인증 정보 조작 감지 시 로그아웃 처리
 */
export const handleAuthTampering = () => {
  console.warn('🚨 인증 정보 조작이 감지되었습니다. 로그아웃 처리합니다.')
  
  // localStorage 정리
  localStorage.removeItem('auth-storage')
  
  // 쿠키 정리
  Cookies.remove('auth-token')
  Cookies.remove('auth-time')
  
  // 로그인 페이지로 리다이렉트
  window.location.href = '/login'
} 