# === Étape 1 : Builder ===
FROM node:22-alpine AS builder
WORKDIR /app

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
# URL factice uniquement pour prisma generate (pas de connexion réelle au build)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Installer build tools pour Prisma
RUN apk add --no-cache python3 make g++ bash

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier uniquement ce qui est nécessaire pour le build
COPY prisma ./prisma
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
COPY prisma.config.ts ./

# Générer le client Prisma (n'a pas besoin d'une vraie BDD)
RUN npx prisma generate

# Build backend (NestJS) sans Sentry sourcemaps
RUN npx nest build

# Upload Sentry sourcemaps uniquement si le token est fourni
RUN if [ -n "$SENTRY_AUTH_TOKEN" ]; then npm run sentry:sourcemaps; else echo "SENTRY_AUTH_TOKEN absent, skip sourcemaps upload"; fi

# === Étape 2 : Runtime minimal ===
FROM node:22-alpine AS production
WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

ENV NODE_ENV=production
ENV PORT=3001

# Copier uniquement les fichiers nécessaires au runtime
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/src ./src

# Créer le dossier uploads et donner les permissions
RUN mkdir -p /app/uploads/avatars && chown -R appuser:appgroup /app/uploads

# Passer à l'utilisateur non-root
USER appuser

# Exposer le port backend
EXPOSE 3001

# Utiliser prisma migrate deploy (pas db push) + démarrage
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
