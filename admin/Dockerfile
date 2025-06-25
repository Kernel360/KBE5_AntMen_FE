# Node.js serve 기반 admin React 앱 Dockerfile

# 빌드 단계
FROM node:20.11-alpine AS builder

# 빌드 도구 설치
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

# package.json 파일들 복사
COPY package.json yarn.lock ./
COPY admin/package.json ./admin/
COPY packages/ui/package.json ./packages/ui/

# apps workspace 더미 생성
RUN mkdir -p apps && echo '{"name": "apps", "private": true, "version": "1.0.0"}' > apps/package.json

# 의존성 설치
RUN yarn install --frozen-lockfile

# 소스 코드 복사
COPY admin/ ./admin/
COPY packages/ui/ ./packages/ui/

# admin 빌드
WORKDIR /app/admin
RUN yarn build

# 프로덕션 단계 - Node.js + serve
FROM node:20.11-alpine

# serve 패키지 전역 설치
RUN npm install -g serve@14

WORKDIR /app

# 빌드된 파일만 복사
COPY --from=builder /app/admin/build ./build

# 포트 노출
EXPOSE 3001

# serve로 정적 파일 서빙 (SPA 지원)
CMD ["serve", "-s", "build", "-l", "3001", "--no-clipboard"]