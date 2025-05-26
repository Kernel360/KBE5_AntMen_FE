FROM node:20-alpine AS builder

WORKDIR /app

COPY ../../package.json ../../yarn.lock ./
COPY ../../packages ./packages
COPY ../../apps ./apps
COPY ./admin ./admin

RUN yarn install --frozen-lockfile
RUN yarn workspace apps-web build  # 또는 정확한 워크스페이스 이름

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/apps-web/.next ./.next
COPY --from=builder /app/apps/apps-web/public ./public
COPY --from=builder /app/apps/apps-web/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3000
CMD ["yarn", "workspace", "apps-web", "start"]
