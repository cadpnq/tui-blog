FROM node:21-alpine3.18 AS base
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache telnet
RUN apk update 

FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune @blog/api --docker

FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/tsconfig.json .
COPY --from=pruner /app/out/full/ .

RUN npm install --filter=@blog/api
RUN npx turbo run build --filter=@blog/api

FROM base AS runner
WORKDIR /app

COPY --from=builder /app .
CMD ["node", "apps/api/dist/index.js"]