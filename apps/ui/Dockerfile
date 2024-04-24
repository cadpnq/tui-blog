FROM node:21-alpine3.18 AS base
RUN apk add --no-cache libc6-compat
RUN apk update 

FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune @blog/ui --docker
 

FROM base AS builder
WORKDIR /app
 
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/tsconfig.json .
COPY --from=pruner /app/out/full/ .

RUN npm install --filter=@blog/ui
RUN npx turbo run build --filter=@blog/ui

FROM nginx
COPY --from=builder /app/apps/ui/dist /usr/share/nginx/html