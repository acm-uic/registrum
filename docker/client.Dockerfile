FROM node:14-alpine AS build

RUN apk add --no-cache git

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY projects/client/package.json projects/client/
COPY projects/common/package.json projects/common/

RUN yarn --pure-lockfile --non-interactive

COPY lerna.json ./
COPY projects/client/ projects/client/
COPY projects/common/ projects/common/
COPY .git/ .git/

RUN yarn build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/projects/client/dist /usr/share/nginx/html
