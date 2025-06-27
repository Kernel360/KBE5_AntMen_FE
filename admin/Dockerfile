# admin/Dockerfile - 패키지 의존성 수정
# 🚀 ULTRA FAST ADMIN VERSION - @antmen/ui 문제 해결

FROM --platform=$BUILDPLATFORM node:20.11-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# 모든 도구 한번에 설치 (Canvas 빌드 포함)
RUN apk add --no-cache libc6-compat python3 make g++ curl

WORKDIR /app

# 🔧 1. ROOT 패키지 파일들 먼저 복사
COPY package.json yarn.lock ./

# 🔧 2. 모든 워크스페이스 package.json 복사
COPY admin/package.json ./admin/
COPY apps/package.json ./apps/
COPY packages/ui/package.json ./packages/ui/ 2>/dev/null || echo '{"name": "@antmen/ui", "version": "0.0.0"}' > ./packages/ui/package.json

# 🔧 3. @antmen/ui 소스 코드 복사 (의존성 해결을 위해 먼저)
COPY packages/ui/ ./packages/ui/ 2>/dev/null || mkdir -p ./packages/ui

# 🚀 병렬 설치 최적화 (메모리 8GB, 동시성 16)
ENV NODE_OPTIONS="--max-old-space-size=8192" \
    npm_config_build_from_source=true \
    PYTHON=/usr/bin/python3 \
    YARN_NETWORK_TIMEOUT=180000

# 🔧 ARM64 yarn 최적화 (prefer-offline 제거 - 의존성 문제 해결)
RUN yarn config set network-concurrency 16 && \
    yarn config set network-timeout 180000 && \
    yarn install --frozen-lockfile

# 🔧 4. 나머지 소스 코드 복사
COPY admin/ ./admin/

# 🚀 빠른 빌드 (소스맵 비활성화, 병렬 처리)
WORKDIR /app/admin
ENV NODE_ENV=production \
    GENERATE_SOURCEMAP=false \
    CI=false \
    SKIP_PREFLIGHT_CHECK=true \
    FAST_REFRESH=false

RUN yarn build

# 런타임 (초경량화)
FROM node:20.11-alpine AS runner

# 한번에 설치 (serve + curl + 사용자)
RUN npm install -g serve@14 && \
    apk add --no-cache curl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S react -u 1001

USER react
WORKDIR /app

# 빌드 결과만 복사
COPY --from=builder --chown=react:nodejs /app/admin/build ./build

EXPOSE 3001

# serve로 정적 파일 서빙
CMD ["serve", "-s", "build", "-l", "3001", "--no-clipboard", "--single"]