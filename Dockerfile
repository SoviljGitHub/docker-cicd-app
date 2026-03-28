# STAGE 1 - build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# STAGE 2 - production
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["node", "index.js"]