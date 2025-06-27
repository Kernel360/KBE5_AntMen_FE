# admin/Dockerfile - 문법 오류 수정
# 🚀 ULTRA FAST ADMIN VERSION - Dockerfile 문법 올바르게

FROM --platform=$BUILDPLATFORM node:20.11-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# 모든 도구 한번에 설치 (Canvas 빌드 포함)
RUN apk add --no-cache libc6-compat python3 make g++ curl

WORKDIR /app

# 🔧 1. ROOT 패키지 파일들 먼저 복사
COPY package.json yarn.lock ./

# 🔧 2. 필수 워크스페이스 package.json 복사
COPY admin/package.json ./admin/

# 🔧 3. apps workspace 더미 생성 (워크스페이스 오류 방지)
RUN mkdir -p apps packages/ui && \
    echo '{"name": "apps", "private": true, "version": "1.0.0"}' > apps/package.json

# 🔧 4. packages/ui 처리 (존재하면 복사, 없으면 더미 생성)
RUN mkdir -p packages/ui
COPY packages/ui/package.json ./packages/ui/package.json 2>/dev/null || true
RUN if [ ! -f ./packages/ui/package.json ]; then \
        echo '{"name": "@antmen/ui", "version": "0.0.0", "main": "index.js"}' > ./packages/ui/package.json && \
        echo 'module.exports = {};' > ./packages/ui/index.js; \
    fi

# 🚀 병렬 설치 최적화 (메모리 8GB, 동시성 16)
ENV NODE_OPTIONS="--max-old-space-size=8192" \
    npm_config_build_from_source=true \
    PYTHON=/usr/bin/python3 \
    YARN_NETWORK_TIMEOUT=180000

# 🔧 ARM64 yarn 최적화 (안전한 설정)
RUN yarn config set network-concurrency 16 && \
    yarn config set network-timeout 180000 && \
    yarn install --frozen-lockfile

# 🔧 5. 소스 코드 복사 (packages/ui가 있다면)
COPY packages/ui/ ./packages/ui/ 2>/dev/null || true
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