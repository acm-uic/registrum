FROM node:12-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci
COPY . .
RUN npm run build --if-present
RUN npm run test --if-present
