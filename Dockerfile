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

COPY . .

RUN rush install --no-link
RUN rush link
RUN rush build

FROM base as api
ENV NODE_ENV=production
WORKDIR /usr/src/app/api
ENTRYPOINT [ "rushx", "start" ]

FROM base as banner
ENV NODE_ENV=production
WORKDIR /usr/src/app/banner
ENTRYPOINT [ "rushx", "start" ]

FROM base as banner-data
ENV NODE_ENV=production
WORKDIR /usr/src/app/banner-data
ENTRYPOINT [ "rushx", "start" ]

FROM nginx:alpine as client
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=base /usr/src/app/client/build /usr/share/nginx/html
