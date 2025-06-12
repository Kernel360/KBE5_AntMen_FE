FROM node:20.11-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/package.json ./apps/

RUN yarn workspace apps install --frozen-lockfile

COPY apps/ ./apps/
RUN yarn workspace apps build

# 2. 런타임 단계
FROM node:20.11-alpine AS runner
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/package.json ./apps/

COPY --from=builder /app/apps/.next ./apps/.next
COPY --from=builder /app/apps/public ./apps/public

RUN yarn workspace apps install --production --frozen-lockfile

EXPOSE 3000
CMD ["yarn", "workspace", "apps", "start"]