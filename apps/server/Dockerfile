FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/server ./apps/server
COPY apps/website/package.json ./apps/website/package.json

RUN pnpm install && pnpm --filter @teddy/server build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN addgroup -S nodejs && adduser -S node -G nodejs
ENV NODE_ENV=production

COPY --from=build /app/apps/server/dist ./dist
COPY --from=build /app/apps/server/package.json ./package.json
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod --no-optional

USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
