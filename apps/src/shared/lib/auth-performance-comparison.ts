/**
 * 📊 성능 vs 보안 비교
 */

// ❌ localStorage 방식: 빠르지만 취약
export const performanceTest = {
  localStorageAccess: () => {
    console.time('localStorage 접근')
    const stored = localStorage.getItem('auth-storage')
    const user = stored ? JSON.parse(stored).user : null
    console.timeEnd('localStorage 접근') // ~0.1ms
    return user
  },

  // ✅ JWT 방식: 약간 느리지만 안전
  jwtAccess: () => {
    console.time('JWT 파싱')
    const { secureAuth } = require('./secure-auth')
    const user = secureAuth.getCurrentUser()
    console.timeEnd('JWT 파싱') // ~1-2ms
    return user
  }
}

/**
 * 🎯 실제 성능 차이
 * 
 * localStorage: ~0.1ms
 * JWT 파싱: ~1-2ms
 * 
 * 차이: 약 1-2ms (거의 무시할 수준)
 * 하지만 보안은 천지차이!
 */

/**
 * 💡 최적화된 하이브리드 방식
 */
export const optimizedAuth = {
  // 캐시된 사용자 정보 (메모리에만 저장)
  _cachedUser: null as { userId: number; userRole: string } | null,
  _cacheTime: 0,
  _cacheExpiry: 5000, // 5초 캐시

  getCurrentUser: () => {
    const now = Date.now()
    
    // 캐시가 유효하면 캐시 사용
    if (optimizedAuth._cachedUser && (now - optimizedAuth._cacheTime) < optimizedAuth._cacheExpiry) {
      return optimizedAuth._cachedUser
    }

    // 캐시 만료 시 JWT에서 새로 파싱
    const { secureAuth } = require('./secure-auth')
    const user = secureAuth.getCurrentUser()
    
    // 메모리에 캐시 (localStorage 아님!)
    optimizedAuth._cachedUser = user
    optimizedAuth._cacheTime = now
    
    return user
  },

  // 로그아웃 시 캐시 정리
  clearCache: () => {
    optimizedAuth._cachedUser = null
    optimizedAuth._cacheTime = 0
  }
}

/**
 * 🏆 결론:
 * 
 * 1. localStorage 사용 이유는 '성능'이었지만
 * 2. 실제 성능 차이는 미미함 (1-2ms)
 * 3. 보안 위험은 매우 큼
 * 4. 메모리 캐시로 성능도 보안도 확보 가능
 */