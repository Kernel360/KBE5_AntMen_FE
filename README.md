# KBE5_AntMen_FE

## 프로젝트 구조
```
KBE5_AntMen_FE/
├── apps/ # Next.js 앱 (사용자/매니저용)
└── admin/ # React 앱 (관리자용)
```


## 설치 방법

### 전체 프로젝트 설치
```bash
# 루트 디렉토리에서
yarn install
```

### 개별 앱 설치
```bash
# Next.js 앱 설치
yarn install:apps

# React 앱 설치
yarn install:admin
```

## 실행 방법

### 전체 앱 동시 실행
```bash
# 루트 디렉토리에서
yarn dev
```

### 개별 앱 실행
```bash
# Next.js 앱 실행 (http://localhost:4000)
yarn dev:apps

# React 앱 실행 (http://localhost:5001)
yarn dev:admin
```

## 빌드 방법

### 전체 앱 빌드
```bash
# 루트 디렉토리에서
yarn build
```

### 개별 앱 빌드
```bash
# Next.js 앱 빌드
yarn build:apps

# React 앱 빌드
yarn build:admin
```

## 기타 명령어

### 린트 검사
```bash
# 전체 앱 린트 검사
yarn lint
```

### 캐시 정리
```bash
# 전체 앱 캐시 정리
yarn clean
```
```