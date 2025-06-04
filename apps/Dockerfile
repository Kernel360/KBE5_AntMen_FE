# apps/Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.json과 yarn.lock 복사
COPY package.json yarn.lock ./
COPY apps/package.json ./apps/

# 의존성 설치
RUN yarn install --frozen-lockfile --ignore-scripts && \
    yarn workspace apps install

# 소스 코드 복사
COPY apps/ ./apps/

# 빌드
RUN yarn workspace apps build

# 포트 설정
EXPOSE 3000

# 실행
CMD ["yarn", "workspace", "apps", "start"]