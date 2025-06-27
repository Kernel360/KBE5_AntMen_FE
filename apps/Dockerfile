# apps/Dockerfile - 1분 이내 빌드 최적화
# 🚀 ULTRA FAST VERSION - 목표: 1분 이내

FROM --platform=$BUILDPLATFORM node:20.11-alpine AS deps
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# 모든 필요 패키지 한번에 설치 (레이어 최소화)
RUN apk add --no-cache libc6-compat python3 make g++ curl

WORKDIR /app

# 캐시 최적화를 위한 분리된 복사
COPY package.json yarn.lock* ./
COPY apps/package.json ./apps/

# 🚀 병렬 최적화 설정 (메모리 8GB, 동시성 16)
ENV YARN_CACHE_FOLDER=/tmp/yarn-cache
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV YARN_NETWORK_TIMEOUT=180000

# ARM64 전용 최적화 (타임아웃 단축, 동시성 최대화)
RUN yarn config set network-timeout 180000 && \
    yarn config set network-concurrency 16 && \
    yarn config set prefer-offline true && \
    yarn workspace apps install --production --frozen-lockfile --prefer-offline

# 빌더 단계 (deps 상속으로 중복 제거)
FROM deps AS builder

# 환경변수들 (한번에 설정)
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_GOOGLE_REDIRECT_URI
ARG NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE
ARG NEXT_PUBLIC_GOOGLE_SCOPE
ARG NEXT_PUBLIC_GOOGLE_AUTH_URL

ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID \
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI=$NEXT_PUBLIC_GOOGLE_REDIRECT_URI \
    NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE=$NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE \
    NEXT_PUBLIC_GOOGLE_SCOPE=$NEXT_PUBLIC_GOOGLE_SCOPE \
    NEXT_PUBLIC_GOOGLE_AUTH_URL=$NEXT_PUBLIC_GOOGLE_AUTH_URL

# dev dependencies 빠른 설치 (오프라인 우선)
RUN yarn workspace apps install --frozen-lockfile --prefer-offline

# 소스 복사 (한번에)
COPY apps/ ./apps/

# 🚀 병렬 빌드 최적화 (4개 워커, 텔레메트리 비활성화)
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_EXPERIMENTAL_BUILD_CONCURRENCY=4 \
    NODE_ENV=production

RUN yarn workspace apps build

# 런타임 (최소화된 Alpine)
FROM node:20.11-alpine AS runner
WORKDIR /app

# 한번에 사용자 생성 및 패키지 설치
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    apk add --no-cache dumb-init curl

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# 빌드 결과만 복사 (최소한의 파일)
COPY --from=builder /app/apps/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/.next/static ./apps/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/public ./apps/public

USER nextjs
EXPOSE 3000

CMD ["dumb-init", "node", "apps/server.js"]