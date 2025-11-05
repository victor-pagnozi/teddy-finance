FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/website ./apps/website
COPY apps/server/package.json ./apps/server/package.json

RUN pnpm install && pnpm --filter @teddy/website build

FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/apps/website/dist /usr/share/nginx/html
COPY apps/website/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
