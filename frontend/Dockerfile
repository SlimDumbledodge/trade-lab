# Étape 1 : Build
FROM node:22-slim AS builder
WORKDIR /app

# Installer pnpm (le projet utilise pnpm-lock.yaml)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Variables d'environnement NEXT_PUBLIC_* nécessaires au build Next.js
ARG NEXT_PUBLIC_NEST_API_URL
ENV NEXT_PUBLIC_NEST_API_URL=$NEXT_PUBLIC_NEST_API_URL

# Installer build tools pour certains packages natifs
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste du projet (sans node_modules grâce au .dockerignore)
COPY . .

# Build NextJS
RUN pnpm run build

# Étape 2 : Runtime minimal
FROM node:22-slim AS production
WORKDIR /app

# Créer un utilisateur non-root
RUN groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -s /bin/false appuser

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
