FROM node:12-alpine AS registrum_base

ARG CLIENT_WEBPUSHPUBLIC

ENV WEBPUSHPUBLIC=$CLIENT_WEBPUSHPUBLIC

RUN apk add --no-cache \
    autoconf \
    automake \
    bash \
    g++ \
    libc6-compat \
    libjpeg-turbo-dev \
    libpng-dev \
    make \
    nasm \
    git

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY projects/banner/package.json projects/banner/
COPY projects/banner-data/package.json projects/banner-data/
COPY projects/api/package.json projects/api/
COPY projects/client/package.json projects/client/
COPY projects/common/package.json projects/common/

RUN yarn

COPY . .

RUN yarn build
RUN yarn test

FROM registrum_base as api

WORKDIR /usr/src/app/projects/api
ENTRYPOINT yarn start

FROM registrum_base as banner

WORKDIR /usr/src/app/projects/banner
ENTRYPOINT yarn start

FROM registrum_base as banner-data

WORKDIR /usr/src/app/projects/banner-data
ENTRYPOINT yarn start

FROM nginx:alpine as client

COPY projects/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=registrum_base /usr/src/app/projects/client/dist /usr/share/nginx/html
