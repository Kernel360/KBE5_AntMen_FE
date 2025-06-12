// components/LoginOrigin.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/shared/stores/authStore'
import { jwtDecode } from 'jwt-decode'

type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN'

interface LoginFormData {
  userLoginId: string
  userPassword: string
}

interface LoginResponse {
  success: boolean
  token?: string
  message?: string
}

interface JwtPayload {
  sub: string // userId (JWT 표준은 'sub'를 subject/id로 사용)
  userRole: string // CUSTOMER | MANAGER | ADMIN
  exp: number // 만료 시간
  iat: number // 발급 시간
}

// 역할 값이 유효한지 검증하는 타입 가드
function isValidUserRole(role: string): role is UserRole {
  return ['CUSTOMER', 'MANAGER', 'ADMIN'].includes(role)
}

export function useLoginOrigin() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const { login: loginToStore } = useAuthStore()

  const login = async (data: LoginFormData) => {
    console.log('Login attempt with:', data)

    // 이전 에러 메시지 초기화
    setLoginError(null)

    try {
      setIsLoading(true)

      const response = await fetch('https://api.antmen.site:9090/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userLoginId: data.userLoginId,
          userPassword: data.userPassword,
        }),
      })

      if (!response.ok) {
        // 서버에서 내려주는 에러 메시지 추출 시도
        let errorMessage = '로그인에 실패했습니다.'
        try {
          const errorBody = await response.json()
          if (errorBody && errorBody.message) {
            errorMessage = errorBody.message
          }
        } catch (e) {
          // JSON 파싱 실패 시 기본 메시지 사용
        }
        setLoginError(errorMessage)
        return { success: false, error: errorMessage }
      }

      const result: LoginResponse = await response.json()
      console.log('서버 응답:', result)

      if (result.success && result.token) {
        // 1. JWT 토큰 디코딩
        const decodedToken = jwtDecode<JwtPayload>(result.token)
        console.log('✅ 토큰 디코딩 결과:', decodedToken)

        // 2. userRole 검증
        if (!isValidUserRole(decodedToken.userRole)) {
          throw new Error('토큰에 포함된 사용자 역할이 유효하지 않습니다.')
        }

        // 3. JWT에서 추출한 정보로 Zustand 스토어에 저장할 사용자 객체 구성
        const user = {
          userId: parseInt(decodedToken.sub),
          userRole: decodedToken.userRole, // 타입이 UserRole로 보장됨
        }

        // 4. Zustand 스토어에 로그인 정보 저장
        loginToStore(user, result.token)
        console.log('💾 authStore 저장 완료')

        // 5. 쿠키에 토큰 저장 (7일 만료)
        const formattedToken = formatTokenForServer(result.token)
        console.log('🍪 쿠키에 저장될 토큰:', formattedToken)

        Cookies.set('auth-token', formattedToken, {
          expires: 7,
          secure: false,
          sameSite: 'strict',
          path: '/',
        })
        console.log('🍪 쿠키 저장 완료')

        Cookies.set('auth-time', new Date().toISOString(), {
          expires: 7,
          secure: false,
          sameSite: 'strict',
          path: '/',
        })

        // 6. userRole에 따라 리다이렉트 경로 설정
        const redirectPath = user.userRole === 'MANAGER' ? '/manager' : '/'
        console.log(`🏠 ${user.userRole} 권한으로 ${redirectPath}로 이동`)
        router.push(redirectPath)

        return { success: true }
      } else {
        // 서버에서 success: false 응답
        const errorMessage = result.message || '로그인에 실패했습니다.'
        setLoginError(errorMessage)

        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('❌ 로그인 요청 중 오류:', error)

      const errorMessage =
        error instanceof Error
          ? error.message
          : '로그인 중 오류가 발생했습니다.'

      setLoginError(errorMessage)

      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const formatTokenForServer = (token: string): string => {
    // 기존 "Bearer " 접두사 제거 (공백 포함/미포함 모두 처리)
    const cleanToken = token.replace(/^Bearer\s*/i, '')
    // "Bearer " (공백 포함) + 토큰 형태로 반환
    return `Bearer ${cleanToken}`
  }

  return {
    login,
    isLoading,
    loginError,
    setLoginError,
  }
}
