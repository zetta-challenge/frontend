# * Image vulnerability checked: 6th/Jun/2025 - 0 vulnerabilities
# https://hub.docker.com/layers/library/node/22-alpine/images/sha256-11d923cca2138d844282dc0c333132bba72deb913d635c3c33e54523b455a4da

FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml svelte.config.js ./
RUN npm install -g pnpm
RUN pnpm i
COPY . .
RUN pnpm build

FROM node:22-alpine AS deploy
WORKDIR /app
RUN addgroup -g 1001 -S svelte-fe
RUN adduser -S svelte -u 1001
COPY --from=builder --chown=svelte:svelte-fe /app/build ./build
COPY --from=builder --chown=svelte:svelte-fe /app/node_modules ./node_modules
COPY --from=builder --chown=svelte:svelte-fe /app/package.json ./package.json

USER svelte
ENV PORT=8080
EXPOSE 8080
CMD ["node", "build"]
# TODO: Add a docker compose using a prebuilt BE image (corresponding env) to run a local dev environment