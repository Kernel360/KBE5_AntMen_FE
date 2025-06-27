/**
 * 개발 환경에서만 사용하는 인증 디버깅 도구
 * 보안 테스트를 위한 시뮬레이션 기능
 */

declare global {
  interface Window {
    authDebug?: {
      tamperUserId: (fakeUserId: number) => void
      tamperUserRole: (fakeRole: string) => void
      tamperBoth: (fakeUserId: number, fakeRole: string) => void
      reset: () => void
      checkConsistency: () => void
    }
  }
}

export const initAuthDebugTools = () => {
  if (process.env.NODE_ENV !== 'development') return
  
  if (typeof window === 'undefined') return
  
  window.authDebug = {
    /**
     * 사용자 ID 조작 시뮬레이션
     */
    tamperUserId: (fakeUserId: number) => {
      console.warn('🔧 [DEBUG] 사용자 ID 조작 시뮬레이션:', fakeUserId)
      
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const parsed = JSON.parse(authStorage)
        if (parsed.state?.user) {
          parsed.state.user.userId = fakeUserId
        } else if (parsed.user) {
          parsed.user.userId = fakeUserId
        }
        localStorage.setItem('auth-storage', JSON.stringify(parsed))
        console.log('✅ localStorage 조작 완료')
      }
    },
    
    /**
     * 사용자 역할 조작 시뮬레이션
     */
    tamperUserRole: (fakeRole: string) => {
      console.warn('🔧 [DEBUG] 사용자 역할 조작 시뮬레이션:', fakeRole)
      
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const parsed = JSON.parse(authStorage)
        if (parsed.state?.user) {
          parsed.state.user.userRole = fakeRole
        } else if (parsed.user) {
          parsed.user.userRole = fakeRole
        }
        localStorage.setItem('auth-storage', JSON.stringify(parsed))
        console.log('✅ localStorage 조작 완료')
      }
    },
    
    /**
     * 사용자 ID와 역할 모두 조작
     */
    tamperBoth: (fakeUserId: number, fakeRole: string) => {
      console.warn('🔧 [DEBUG] 전체 인증 정보 조작 시뮬레이션:', { fakeUserId, fakeRole })
      
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const parsed = JSON.parse(authStorage)
        if (parsed.state?.user) {
          parsed.state.user.userId = fakeUserId
          parsed.state.user.userRole = fakeRole
        } else if (parsed.user) {
          parsed.user.userId = fakeUserId
          parsed.user.userRole = fakeRole
        }
        localStorage.setItem('auth-storage', JSON.stringify(parsed))
        console.log('✅ localStorage 조작 완료')
      }
    },
    
    /**
     * 원래 상태로 복구 (페이지 새로고침)
     */
    reset: () => {
      console.log('🔄 [DEBUG] 인증 상태 리셋')
      window.location.reload()
    },
    
    /**
     * 현재 인증 일관성 검사
     */
    checkConsistency: () => {
      const { validateAuthConsistency } = require('./auth-validator')
      const result = validateAuthConsistency()
      
      console.group('🔍 [DEBUG] 인증 일관성 검사 결과')
      console.log('유효성:', result.isValid)
      console.log('토큰 사용자:', result.tokenUser)
      console.log('저장된 사용자:', result.storedUser)
      if (result.error) console.error('오류:', result.error)
      console.groupEnd()
      
      return result
    }
  }
  
  console.log(`
🔧 인증 디버그 도구가 활성화되었습니다!

사용법:
• authDebug.tamperUserId(999) - 사용자 ID 조작
• authDebug.tamperUserRole('ADMIN') - 역할 조작  
• authDebug.tamperBoth(999, 'ADMIN') - 모두 조작
• authDebug.checkConsistency() - 일관성 검사
• authDebug.reset() - 리셋

⚠️  조작 후 페이지를 이동하거나 API를 호출해보세요!
  `)
} 