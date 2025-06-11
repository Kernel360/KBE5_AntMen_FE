# admin/Dockerfile
FROM node:20.11-alpine

WORKDIR /app

# 패키지 파일 복사
COPY package.json yarn.lock ./
COPY admin/package.json ./admin/
COPY packages/ui/package.json ./packages/ui/

# 의존성 설치
RUN yarn install

# 소스 코드 복사
COPY . .

# 빌드
RUN yarn build:admin

# 포트 설정
EXPOSE 3001

# 실행
CMD ["yarn", "start:admin"]