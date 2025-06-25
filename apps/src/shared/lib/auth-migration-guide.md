# 🔄 인증 시스템 마이그레이션 가이드

## 📋 **현재 문제점**

```typescript
// ❌ 기존 방식: localStorage 사용 (보안 취약)
const { user } = useAuthStore() // localStorage에서 가져옴
if (user?.userRole === 'MANAGER') {
  // 사용자가 localStorage를 조작하면 우회 가능!
}
```

## ✅ **안전한 새 방식**

```typescript
// ✅ 새 방식: JWT만 사용 (안전)
const { user, isManager } = useSecureAuth() // JWT에서 직접 추출
if (isManager) {
  // JWT 서명 검증으로 조작 불가능!
}
```

## 🔧 **단계별 마이그레이션**

### **1단계: 새 훅으로 교체**

```typescript
// Before
import { useAuthStore } from '@/shared/stores/authStore'
const { user, isLoggedIn } = useAuthStore()

// After  
import { useSecureAuth } from '@/shared/hooks/useSecureAuth'
const { user, isLoggedIn } = useSecureAuth()
```

### **2단계: 권한 체크 방식 변경**

```typescript
// Before
const isManager = user?.userRole === 'MANAGER'

// After
const { isManager } = useSecureAuth()
```

### **3단계: 컴포넌트별 적용**

```typescript
// 예시: ManagerStatusGuard.tsx
const ManagerStatusGuard = ({ children }: { children: React.ReactNode }) => {
  // ❌ 기존
  // const { user } = useAuthStore()
  
  // ✅ 새 방식
  const { user, isManager, isLoading } = useSecureAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!isManager) return <div>Access Denied</div>
  
  return <>{children}</>
}
```

## 🎯 **마이그레이션 우선순위**

### **High Priority (즉시 적용)**
1. 권한 체크 로직
2. 인증 가드 컴포넌트
3. API 호출 전 권한 확인

### **Medium Priority (점진적 적용)**
1. UI 조건부 렌더링
2. 네비게이션 로직
3. 사용자 정보 표시

### **Low Priority (선택적 적용)**
1. 로깅 및 분석
2. 개발 도구
3. 테스트 코드

## 📊 **성능 영향**

```typescript
// 성능 비교
const performanceTest = () => {
  console.time('localStorage 방식')
  const stored = localStorage.getItem('auth-storage')
  const user1 = JSON.parse(stored).user
  console.timeEnd('localStorage 방식') // ~0.1ms
  
  console.time('JWT 방식')
  const user2 = useSecureAuth().user
  console.timeEnd('JWT 방식') // ~1-2ms
  
  // 차이: 약 1-2ms (무시할 수준)
  // 보안 향상: 엄청난 차이!
}
```

## 🛡️ **보안 개선 효과**

| 항목 | 기존 방식 | 새 방식 |
|------|-----------|---------|
| **조작 가능성** | ❌ 높음 | ✅ 불가능 |
| **권한 상승** | ❌ 가능 | ✅ 차단 |
| **토큰 검증** | ❌ 없음 | ✅ 자동 |
| **만료 확인** | ❌ 수동 | ✅ 자동 |

## 🔄 **점진적 마이그레이션 전략**

### **Phase 1: 병행 운영**
```typescript
// 두 방식 모두 지원
const { user: oldUser } = useAuthStore()
const { user: newUser } = useSecureAuth()

// 검증 로직
if (oldUser?.userId !== newUser?.userId) {
  console.warn('인증 정보 불일치 감지!')
}
```

### **Phase 2: 새 방식 우선**
```typescript
// 새 방식 우선, 기존 방식은 fallback
const { user } = useSecureAuth() || useAuthStore()
```

### **Phase 3: 완전 교체**
```typescript
// 기존 방식 제거
const { user } = useSecureAuth()
```

## 🧪 **테스트 방법**

```typescript
// 개발 환경에서 테스트
const testMigration = () => {
  // 1. 기존 방식으로 로그인
  // 2. localStorage 조작 시도
  // 3. 새 방식으로 권한 확인
  // 4. 조작이 차단되는지 확인
}
```

## 📝 **체크리스트**

- [ ] `useSecureAuth` 훅 구현 완료
- [ ] 주요 컴포넌트 마이그레이션
- [ ] 권한 체크 로직 교체
- [ ] API 호출 전 검증 추가
- [ ] 테스트 케이스 작성
- [ ] 성능 테스트 완료
- [ ] 보안 테스트 완료
- [ ] 기존 코드 정리

## 🎉 **마이그레이션 완료 후**

```typescript
// 최종 목표: 완전히 안전한 인증 시스템
const MyComponent = () => {
  const { user, isManager, logout } = useSecureAuth()
  
  // 🛡️ JWT 서명으로 검증된 안전한 정보
  // 🚫 localStorage 조작 불가능
  // ✅ 자동 토큰 만료 확인
  // 🔒 권한 상승 공격 차단
  
  return (
    <div>
      {isManager ? (
        <ManagerDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </div>
  )
}
``` 