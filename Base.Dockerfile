FROM node:12-alpine AS base

ENV NODE_ENV=development \
    CI=true

RUN apk add --no-cache \
    autoconf \
    automake \
    bash \
    g++ \
    libc6-compat \
    libjpeg-turbo-dev \
    libpng-dev \
    make \
    nasm

RUN npm i -g @microsoft/rush

WORKDIR /usr/src/app

COPY projects/banner/package.json projects/banner/
COPY projects/banner-data/package.json projects/banner-data/
COPY projects/api/package.json projects/api/
COPY projects/client/package.json projects/client/
COPY projects/common/package.json projects/common/
COPY common/ common
COPY rush.json .

RUN rush install --no-link

COPY . .

RUN rush link
RUN rush build
