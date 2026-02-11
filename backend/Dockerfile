# === Étape 1 : Builder ===
FROM node:22-alpine AS builder
WORKDIR /app

ARG DATABASE_URL
ARG SENTRY_AUTH_TOKEN
ENV DATABASE_URL=$DATABASE_URL
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# Installer build tools pour Prisma
RUN apk add --no-cache python3 make g++ bash

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Build backend (NestJS)
RUN npm run build

# === Étape 2 : Runtime ===
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copier depuis le builder
COPY --from=builder /app ./

# Installer Prisma runtime (pour db push/migrate)
RUN npm install --production

# Exposer le port backend
EXPOSE 3001

# Étape initialisation base + start
CMD npx prisma db push && npm run start:prod
