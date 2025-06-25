import { validateAuthConsistency, handleAuthTampering } from '@/shared/lib/auth-validator'

/**
 * API 호출 전 인증 정보 검증 미들웨어
 */
export const authInterceptor = {
  /**
   * 요청 전 인증 검증
   */
  beforeRequest: (): boolean => {
    if (typeof window === 'undefined') return true // SSR에서는 스킵
    
    const validation = validateAuthConsistency()
    
    if (!validation.isValid) {
      console.error('🚨 API 호출 전 인증 검증 실패:', validation.error)
      
      // 조작이 감지된 경우 즉시 차단
      if (validation.error?.includes('일치하지 않습니다')) {
        handleAuthTampering()
        return false
      }
      
      // 토큰 만료 등 기타 오류는 API가 처리하도록 허용
      return true
    }
    
    return true
  },
  
  /**
   * 안전한 fetch 래퍼
   */
  safeFetch: async (url: string, options: RequestInit = {}): Promise<Response> => {
    // 요청 전 검증
    if (!authInterceptor.beforeRequest()) {
      throw new Error('인증 정보가 조작되어 요청이 차단되었습니다')
    }
    
    return fetch(url, options)
  }
}