# 최종 최적화된 admin React 앱 Dockerfile
# 외부 nginx 사용, 컨테이너는 정적 파일만 서빙

# 빌드 단계
FROM --platform=$BUILDPLATFORM node:20.11-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# 🚀 ARM64 최적화 - Canvas 빌드를 위한 도구 설치
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++

WORKDIR /app

# 1. package.json 파일들 복사 (최적 캐싱)
COPY package.json yarn.lock ./
COPY admin/package.json ./admin/
COPY packages/ui/package.json ./packages/ui/

# 2. apps workspace 더미 생성 (워크스페이스 오류 방지)
RUN mkdir -p apps && \
    echo '{"name": "apps", "private": true, "version": "1.0.0"}' > apps/package.json

# 3. 🎯 ARM64 최적화된 환경변수 설정
ENV PYTHON=/usr/bin/python3
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV npm_config_build_from_source=true

# 🚀 ARM64 yarn 최적화
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; then \
        yarn config set network-timeout 600000 && \
        yarn config set network-concurrency 8; \
    fi

# 4. 의존성 설치 (프로덕션 최적화)
RUN yarn install --frozen-lockfile --network-timeout 300000

# 5. 소스 코드 복사 (필요한 것만)
COPY admin/ ./admin/
COPY packages/ui/ ./packages/ui/

# 6. 빌드 실행
WORKDIR /app/admin
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV CI=false
ENV SKIP_PREFLIGHT_CHECK=true

RUN yarn build

# 프로덕션 단계 - serve 사용 (외부 nginx와 연동)
FROM node:20.11-alpine AS runner

# serve 패키지 전역 설치
RUN npm install -g serve@14 && \
    addgroup -g 1001 -S nodejs && \
    adduser -S react -u 1001

USER react

WORKDIR /app

# 빌드된 파일만 복사
COPY --from=builder --chown=react:nodejs /app/admin/build ./build

EXPOSE 3001

# serve로 정적 파일 서빙 (외부 nginx가 프록시)
CMD ["serve", "-s", "build", "-l", "3001", "--no-clipboard", "--single"]