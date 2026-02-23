# Use official Node.js LTS image
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
EXPOSE 4000
CMD ["pnpm", "run", "dev"]
