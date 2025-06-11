FROM node:20.11-alpine

WORKDIR /app

# 루트 package.json, yarn.lock 복사
COPY package.json yarn.lock ./
# 모든 워크스페이스의 package.json도 복사
COPY apps/package.json ./apps/
COPY admin/package.json ./admin/
COPY packages/ui/package.json ./packages/ui/

# 의존성 설치
RUN yarn install

# 전체 소스 복사
COPY . .

# 빌드
RUN yarn build

CMD ["yarn", "start"]