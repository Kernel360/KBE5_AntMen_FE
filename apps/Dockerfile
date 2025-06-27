# 1. Dependencies 설치 단계
FROM --platform=$BUILDPLATFORM node:20.11-alpine AS deps
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# 🚀 ARM64 크로스 컴파일 최적화
RUN apk add --no-cache libc6-compat && \
    if [ "$TARGETPLATFORM" = "linux/arm64" ]; then \
        apk add --no-cache python3 make g++; \
    fi

WORKDIR /app

# package.json과 lock 파일만 먼저 복사 (캐시 최적화)
COPY package.json yarn.lock* ./
COPY apps/package.json ./apps/

# 🎯 ARM64 최적화된 yarn 설정
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; then \
        yarn config set network-timeout 600000; \
    fi && \
    yarn workspace apps install --production --frozen-lockfile

# 2. 빌더 단계
FROM --platform=$BUILDPLATFORM node:20.11-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

WORKDIR /app

# 빌드 시점 환경변수
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_GOOGLE_REDIRECT_URI
ARG NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE
ARG NEXT_PUBLIC_GOOGLE_SCOPE
ARG NEXT_PUBLIC_GOOGLE_AUTH_URL

ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_REDIRECT_URI=$NEXT_PUBLIC_GOOGLE_REDIRECT_URI
ENV NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE=$NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE
ENV NEXT_PUBLIC_GOOGLE_SCOPE=$NEXT_PUBLIC_GOOGLE_SCOPE
ENV NEXT_PUBLIC_GOOGLE_AUTH_URL=$NEXT_PUBLIC_GOOGLE_AUTH_URL

# 🚀 Node.js 메모리 최적화
ENV NODE_OPTIONS="--max-old-space-size=4096"

# ARM64 빌드 최적화
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; then \
        apk add --no-cache python3 make g++; \
    fi

# 패키지 파일들 복사
COPY package.json yarn.lock* ./
COPY apps/package.json ./apps/

# 🎯 ARM64 최적화된 설치
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; then \
        yarn config set network-timeout 600000; \
    fi && \
    yarn workspace apps install --frozen-lockfile

# 소스코드 복사
COPY apps/ ./apps/

# Next.js 빌드 (standalone 모드)
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn workspace apps build

# 3. 런타임 단계 (최적화)
FROM node:20.11-alpine AS runner
WORKDIR /app

# 보안을 위한 non-root 유저 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 필요한 패키지만 설치
RUN apk add --no-cache dumb-init

# Next.js 설정
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# standalone 모드에서 필요한 파일들만 복사
COPY --from=builder /app/apps/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/.next/static ./apps/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/public ./apps/public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# dumb-init을 사용하여 signal 처리 최적화
CMD ["dumb-init", "node", "apps/server.js"]