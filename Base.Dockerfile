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

COPY banner/package.json banner/
COPY banner-data/package.json banner-data/
COPY api/package.json api/
COPY client/package.json client/
COPY common/ common
COPY rush.json .

RUN rush install --no-link

COPY . .

RUN rush link
RUN rush build
