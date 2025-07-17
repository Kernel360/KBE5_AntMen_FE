# 🐜 AntMen Frontend

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Yarn](https://img.shields.io/badge/Yarn-1.22.22-2C8EBB?style=for-the-badge&logo=yarn)

**취준생들이 만든 청소 서비스 플랫폼의 프론트엔드 시스템** 🚀

</div>

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [개발 가이드](#-개발-가이드)
- [배포](#-배포)
- [기여하기](#-기여하기)

---

## 🎯 프로젝트 소개

**AntMen Frontend**는 사용자 친화적인 웹 애플리케이션으로, 고객과 매니저, 관리자가 각각의 역할에 맞는 기능을 사용할 수 있도록 설계되었습니다.

### 주요 기능
- 🏠 **다양한 청소 서비스**: 가사청소, 주방청소, 상업공간청소, 입주청소, 육아서비스
- 📱 **반응형 디자인**: 모바일과 데스크톱에서 최적화된 사용자 경험
- 🔐 **소셜 로그인**: Google, 카카오 등 다양한 소셜 로그인 지원
- 💳 **결제 시스템**: 안전하고 편리한 결제 처리
- 📊 **실시간 알림**: 서비스 상태 및 예약 관련 실시간 알림
- ⭐ **리뷰 시스템**: 서비스 품질 향상을 위한 리뷰 및 평점 시스템

### 아키텍처
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     apps/       │    │     admin/      │    │   packages/ui/  │
│  (Next.js 앱)   │    │  (React 앱)     │    │  (공통 UI)      │
│  고객/매니저용  │    │   관리자용      │    │   컴포넌트      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   shared/       │
                    │   (공통 기능)   │
                    └─────────────────┘
```

---

## 🛠 기술 스택

### Frontend Framework
- **Next.js 14.1.0** - React 기반 풀스택 프레임워크 (App Router)
- **React 18.2.0** - 사용자 인터페이스 구축을 위한 라이브러리
- **TypeScript 5.0** - 정적 타입 검사를 통한 안정적인 개발

### Styling & UI
- **Tailwind CSS 3.3.0** - 유틸리티 퍼스트 CSS 프레임워크
- **Radix UI** - 접근성이 뛰어난 UI 컴포넌트 라이브러리
- **Headless UI** - 완전히 스타일링 가능한 UI 컴포넌트
- **Lucide React** - 아름다운 아이콘 라이브러리
- **Framer Motion** - 부드러운 애니메이션 라이브러리

### State Management & Data Fetching
- **Zustand** - 가벼운 상태 관리 라이브러리
- **React Query (TanStack Query)** - 서버 상태 관리
- **React Hook Form** - 폼 상태 관리 및 유효성 검사

### Authentication & Security
- **NextAuth.js** - 인증 솔루션
- **JWT** - 토큰 기반 인증
- **js-cookie** - 쿠키 관리

### Development Tools
- **Yarn** - 패키지 매니저
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Craco** - Create React App 설정 오버라이드

---

## 📁 프로젝트 구조

```
KBE5_AntMen_FE/
├── 📦 apps/              # Next.js 앱 (고객/매니저용)
│   ├── src/
│   │   ├── app/          # App Router 페이지
│   │   ├── components/   # 재사용 가능한 컴포넌트
│   │   ├── features/     # 기능별 모듈
│   │   ├── shared/       # 공통 기능
│   │   └── widgets/      # 위젯 컴포넌트
│   ├── public/           # 정적 파일
│   └── package.json
├── 📦 admin/             # React 앱 (관리자용)
│   ├── src/
│   │   ├── components/   # 관리자용 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   └── api/          # API 호출 함수
│   ├── public/           # 정적 파일
│   └── package.json
├── 📦 packages/ui/       # 공통 UI 컴포넌트
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   └── package.json
├── 🐳 docker-compose.yml # Docker 설정
└── 📄 package.json       # 루트 패키지 설정
```

### 앱별 역할

| 앱 | 포트 | 역할 | 주요 기능 |
|------|------|------|-----------|
| `apps` | 3000 | 고객/매니저용 | 예약, 결제, 리뷰, 채팅 |
| `admin` | 3001 | 관리자용 | 전체 관리, 통계, 사용자 관리 |
| `packages/ui` | - | 공통 UI | 재사용 가능한 컴포넌트 |

---

## 🚀 시작하기

### 1. 사전 요구사항

- **Node.js 18.0** 이상
- **Yarn 1.22.22** 이상
- **Git** - 버전 관리

### 2. 프로젝트 클론

```bash
git clone https://github.com/your-username/KBE5_AntMen_FE.git
cd KBE5_AntMen_FE
```

### 3. 의존성 설치

#### 3.1 전체 프로젝트 설치

```bash
# 루트 디렉토리에서 모든 의존성 설치
yarn install
```

#### 3.2 개별 앱 설치

```bash
# Next.js 앱 설치
yarn install:apps

# React 앱 설치
yarn install:admin

# 공통 UI 패키지 설치
yarn install:packages
```

### 4. 환경 설정

#### 4.1 환경변수 파일 생성

각 앱의 루트 디렉토리에 환경변수 파일을 생성하세요:

**apps/.env.local:**
```bash
# API 설정
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:8083

# 인증 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# 소셜 로그인 설정
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**admin/.env:**
```bash
REACT_APP_API_URL=http://localhost:8083
REACT_APP_CUSTOMER_API_URL=http://localhost:8081
```

### 5. 개발 서버 실행

#### 5.1 전체 앱 동시 실행

```bash
# 루트 디렉토리에서 모든 앱 실행
yarn dev
```

#### 5.2 개별 앱 실행

```bash
# Next.js 앱 실행 (http://localhost:3000)
yarn dev:apps

# React 앱 실행 (http://localhost:3001)
yarn dev:admin
```

#### 5.3 HTTPS 개발환경 설정

```bash
# 처음 한 번만 실행 (개인 PC에서)
yarn setup-https

# HTTPS로 개발 서버 실행
yarn dev:apps:https
```

### 6. 서비스 접속

| 서비스 | URL | 설명 |
|--------|-----|------|
| 고객/매니저 앱 | http://localhost:3000 | Next.js 기반 메인 앱 |
| 관리자 앱 | http://localhost:3001 | React 기반 관리자 앱 |
| HTTPS 앱 | https://localhost:3000 | 보안 연결 (개발용) |

---

## 👨‍💻 개발 가이드

### 코드 구조 (Feature-Sliced Design)

```
src/
├── app/              # App Router 페이지
├── components/       # 재사용 가능한 컴포넌트
│   ├── entities/     # 도메인 엔티티
│   ├── features/     # 비즈니스 기능
│   ├── shared/       # 공통 기능
│   └── widgets/      # 복합 컴포넌트
├── shared/           # 공통 기능
│   ├── api/          # API 호출 함수
│   ├── components/   # 공통 컴포넌트
│   ├── hooks/        # 커스텀 훅
│   ├── lib/          # 유틸리티 함수
│   ├── stores/       # 상태 관리
│   ├── types/        # 타입 정의
│   └── ui/           # UI 컴포넌트
└── widgets/          # 위젯 컴포넌트
```

### 컴포넌트 작성 가이드

#### 1. 컴포넌트 구조
```tsx
// components/features/auth/ui/LoginForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

interface LoginFormProps {
  onSubmit: (data: LoginData) => void
  isLoading?: boolean
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="이메일을 입력하세요"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
      />
      <Input
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  )
}
```

#### 2. API 호출 함수
```tsx
// shared/api/auth.ts
import { apiClient } from './apiClient'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    email: string
    name: string
    role: 'customer' | 'manager' | 'admin'
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  }
}
```

#### 3. 커스텀 훅
```tsx
// shared/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { authApi, LoginRequest, LoginResponse } from '@/shared/api/auth'

export const useAuth = () => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data)
      setUser(response.user)
      // 토큰 저장 로직
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      setUser(null)
      // 토큰 삭제 로직
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  useEffect(() => {
    // 초기 인증 상태 확인
    // 토큰 검증 및 사용자 정보 로드
    setIsLoading(false)
  }, [])

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  }
}
```

### 스타일링 가이드

#### 1. Tailwind CSS 사용
```tsx
// 기본 스타일링
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">제목</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
    버튼
  </button>
</div>

// 반응형 디자인
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 그리드 아이템들 */}
</div>

// 다크모드 지원
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* 컨텐츠 */}
</div>
```

#### 2. 커스텀 CSS 클래스
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm p-6;
  }
}
```

### 상태 관리

#### 1. Zustand 스토어
```tsx
// shared/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  accessToken: string | null
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ accessToken: token }),
      logout: () => set({ user: null, accessToken: null })
    }),
    {
      name: 'auth-storage'
    }
  )
)
```

### 테스트 작성

#### 1. 컴포넌트 테스트
```tsx
// __tests__/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/components/features/auth/ui/LoginForm'

describe('LoginForm', () => {
  it('로그인 폼이 올바르게 렌더링된다', () => {
    const mockOnSubmit = jest.fn()
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByPlaceholderText('이메일을 입력하세요')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('비밀번호를 입력하세요')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('폼 제출 시 올바른 데이터가 전달된다', () => {
    const mockOnSubmit = jest.fn()
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByPlaceholderText('이메일을 입력하세요'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력하세요'), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })
})
```

### 빌드 및 배포

#### 1. 개발 빌드
```bash
# 전체 앱 빌드
yarn build

# 개별 앱 빌드
yarn build:apps
yarn build:admin
```

#### 2. 프로덕션 빌드
```bash
# 환경변수 설정
export NODE_ENV=production

# 프로덕션 빌드
yarn build
```

#### 3. Docker 배포
```bash
# Docker 이미지 빌드
docker-compose build

# 컨테이너 실행
docker-compose up -d
```

---

## 🚀 배포

### 1. 정적 사이트 배포 (Vercel)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### 2. Docker 배포

```bash
# 프로덕션 이미지 빌드
docker build -t antmen-frontend:prod .

# 컨테이너 실행
docker run -d -p 80:3000 antmen-frontend:prod
```

### 3. 환경별 설정

#### 개발 환경
```bash
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_ENV=development
```

#### 프로덕션 환경
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.antmen.com
NEXT_PUBLIC_ENV=production
```

---

## 🤝 기여하기

### 1. 이슈 리포트

버그를 발견하거나 새로운 기능을 제안하고 싶다면 [Issues](../../issues)를 통해 알려주세요.

### 2. 풀 리퀘스트

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. 풀 리퀘스트를 생성합니다

### 3. 개발 환경 설정

```bash
# 개발 브랜치 생성
git checkout -b develop

# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev
```

### 4. 코드 품질 관리

```bash
# 린트 검사
yarn lint

# 타입 체크
yarn type-check

# 테스트 실행
yarn test
```

---

## 📞 문의 및 지원

### 팀 정보
- **프로젝트**: AntMen Frontend
- **개발자**: 취준생 개발팀 🎓
- **기술 스택**: Next.js, React, TypeScript, Tailwind CSS

### 연락처
- **이메일**: antmen.dev@gmail.com
- **GitHub**: [@antmen-team](https://github.com/antmen-team)

### 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

<div align="center">

**취준생들의 열정으로 만든 프로젝트입니다! 🚀**

⭐ **이 프로젝트가 도움이 되었다면 스타를 눌러주세요!** ⭐

</div>