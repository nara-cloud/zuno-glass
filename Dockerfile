FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
COPY patches/ ./patches/

RUN pnpm install --frozen-lockfile

COPY . .

# Compilar APENAS o servidor - o dist/public já está pré-compilado no repo
RUN npx esbuild server/standalone.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "dist/standalone.js"]
