FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
COPY patches/ ./patches/

RUN pnpm install --frozen-lockfile

COPY . .

# Limpar cache e compilar tudo do zero (frontend + servidor)
RUN rm -rf node_modules/.cache dist && pnpm run build

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "dist/standalone.js"]
