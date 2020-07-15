FROM node:12-alpine AS registrum_base

ARG CLIENT_WEBPUSHPUBLIC

ENV NODE_ENV=production \
    CI=true \
    WEBPUSHPUBLIC=$CLIENT_WEBPUSHPUBLIC

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

FROM node:12-alpine as api
ENV NODE_ENV=production
WORKDIR /usr/src/app/projects/common

COPY --from=registrum_base /usr/src/app/projects/common/package.json .
COPY --from=registrum_base /usr/src/app/projects/common/dist dist
RUN npm link

WORKDIR /usr/src/app/projects/api
COPY --from=registrum_base /usr/src/app/projects/api/package.json .
RUN npm link registrum-common
RUN npm install --production
COPY --from=registrum_base /usr/src/app/projects/api/dist dist

ENTRYPOINT [ "npm", "run", "start" ]


FROM node:12-alpine as banner
ENV NODE_ENV=production
WORKDIR /usr/src/app/projects/common

COPY --from=registrum_base /usr/src/app/projects/common/package.json .
COPY --from=registrum_base /usr/src/app/projects/common/dist dist
RUN npm link

WORKDIR /usr/src/app/projects/banner
COPY --from=registrum_base /usr/src/app/projects/banner/package.json .
RUN npm link registrum-common
RUN npm install --production
COPY --from=registrum_base /usr/src/app/projects/banner/dist dist

ENTRYPOINT [ "npm", "run", "start" ]


FROM node:12-alpine as banner-data
ENV NODE_ENV=production
WORKDIR /usr/src/app/projects/common

COPY --from=registrum_base /usr/src/app/projects/common/package.json .
COPY --from=registrum_base /usr/src/app/projects/common/dist dist
RUN npm link

WORKDIR /usr/src/app/projects/banner-data
COPY --from=registrum_base /usr/src/app/projects/banner-data/package.json .
RUN npm link registrum-common
RUN npm install --production
COPY --from=registrum_base /usr/src/app/projects/banner-data/dist dist

ENTRYPOINT [ "npm", "run", "start" ]


FROM nginx:alpine as client

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=registrum_base /usr/src/app/projects/client/dist /usr/share/nginx/html
