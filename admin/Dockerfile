FROM node:20-alpine AS builder

WORKDIR /app

# 루트 기준으로 복사 (context가 루트이기 때문)
COPY package.json yarn.lock ./
COPY packages ./packages
COPY admin ./admin

RUN yarn install --frozen-lockfile
RUN yarn workspace admin build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/admin/build ./build
COPY --from=builder /app/admin/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3001

CMD ["yarn", "workspace", "admin", "start"]
