FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install
RUN apk add --no-cache curl
RUN npx prisma generate

COPY . .



EXPOSE 3000

CMD ["node", "dist/index.js"]
