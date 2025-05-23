FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 복사 및 설치
COPY ../../package.json ../../yarn.lock ./
COPY ../../packages ./packages
COPY ./ ./

RUN yarn install --frozen-lockfile
RUN yarn workspace apps build

# 2. 런타임 스테이지
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/.next ./.next
COPY --from=builder /app/apps/public ./public
COPY --from=builder /app/apps/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3000

CMD ["yarn", "workspace", "apps", "start"]