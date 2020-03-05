FROM node:12-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

RUN apk add python3 && npm ci
COPY . .
RUN npm run build --if-present
RUN npm run test --if-present
