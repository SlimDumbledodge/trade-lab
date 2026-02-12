# Étape 1 : Build
FROM node:22-alpine AS builder
WORKDIR /app

# Installer pnpm (le projet utilise pnpm-lock.yaml)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Installer build tools pour certains packages natifs
RUN apk add --no-cache python3 make g++

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste du projet (sans node_modules grâce au .dockerignore)
COPY . .

# Build NextJS
RUN pnpm run build

# Étape 2 : Runtime minimal
FROM node:22-alpine AS production
WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

# Copier uniquement les fichiers nécessaires
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Passer à l'utilisateur non-root
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
