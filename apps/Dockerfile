# 1. 빌더 단계
FROM node:18-alpine AS builder
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package.json yarn.lock ./
COPY apps/package.json ./apps/
RUN yarn install --frozen-lockfile

# 소스 복사 및 빌드
COPY apps/ ./apps/
RUN yarn workspace apps build

# 2. 런타임 단계
FROM node:18-alpine AS runner
WORKDIR /app

# 빌드 결과물과 필요한 파일만 복사
COPY --from=builder /app/apps/.next ./apps/.next
COPY --from=builder /app/apps/public ./apps/public
COPY --from=builder /app/apps/package.json ./apps/package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# 프로덕션 의존성만 설치
RUN yarn install --frozen-lockfile --production

EXPOSE 3000

CMD ["yarn", "workspace", "apps", "start"]