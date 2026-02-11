# Étape 1 : Build
FROM node:22-alpine AS builder
WORKDIR /app

# Installer build tools pour certains packages natifs
RUN apk add --no-cache python3 make g++

# Copier uniquement les fichiers package.json / package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet (sans node_modules grâce au .dockerignore)
COPY . .

# Build NextJS
RUN npm run build

# Étape 2 : Runtime
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copier depuis le builder
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
