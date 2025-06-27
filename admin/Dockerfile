# admin/Dockerfile - 30초 이내 빌드 최적화
# 🚀 ULTRA FAST ADMIN VERSION - 목표: 30초 이내

FROM --platform=$BUILDPLATFORM node:20.11-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# 모든 도구 한번에 설치 (Canvas 빌드 포함)
RUN apk add --no-cache libc6-compat python3 make g++ curl

WORKDIR /app

# 캐시 친화적 복사 (package.json만 먼저)
COPY package.json yarn.lock ./
COPY admin/package.json ./admin/

# 🚀 워크스페이스 최적화 (더미 생성으로 에러 방지)
RUN mkdir -p apps packages/ui && \
    echo '{"name": "apps", "private": true, "version": "1.0.0"}' > apps/package.json && \
    echo '{"name": "@repo/ui", "version": "0.0.0", "main": "index.js"}' > packages/ui/package.json && \
    echo 'module.exports = {};' > packages/ui/index.js

# 🚀 병렬 설치 최적화 (메모리 8GB, 동시성 16)
ENV NODE_OPTIONS="--max-old-space-size=8192" \
    npm_config_build_from_source=true \
    PYTHON=/usr/bin/python3 \
    YARN_NETWORK_TIMEOUT=180000

RUN yarn config set network-concurrency 16 && \
    yarn config set network-timeout 180000 && \
    yarn config set prefer-offline true && \
    yarn install --frozen-lockfile --prefer-offline

# 소스 복사 (필요한 것만)
COPY admin/ ./admin/
RUN if [ -d "./packages/ui" ]; then COPY packages/ui/ ./packages/ui/; fi

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