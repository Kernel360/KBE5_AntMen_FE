# Multi-stage build로 최적화
FROM node:20.11-alpine AS base

# 필요한 도구들 설치
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 의존성 설치 단계 (캐시 최적화)
FROM base AS deps
# 루트 및 필요한 workspace의 package.json만 복사
COPY package.json yarn.lock ./
COPY admin/package.json ./admin/
COPY packages/ui/package.json ./packages/ui/
# apps는 admin 빌드에 불필요하므로 제외

# 프로덕션 의존성만 설치
RUN yarn install --frozen-lockfile --production=false

# 빌드 단계
FROM base AS builder
WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules

# 빌드에 필요한 소스만 복사
COPY admin/ ./admin/
COPY packages/ui/ ./packages/ui/
COPY package.json yarn.lock ./

# admin 빌드만 실행
WORKDIR /app/admin
RUN yarn build

# 프로덕션 실행 단계 (정적 파일 서빙)
FROM node:20.11-alpine AS runner

RUN apk add --no-cache serve

WORKDIR /app

# 빌드된 파일만 복사
COPY --from=builder /app/admin/build ./build

EXPOSE 3001

# serve로 정적 파일 서빙 (SPA 지원)
CMD ["npx", "serve", "-s", "build", "-l", "3001"]