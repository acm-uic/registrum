FROM node:14-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY projects/banner-data/package.json projects/banner-data/
COPY projects/common/package.json projects/common/

RUN yarn --pure-lockfile --non-interactive

COPY lerna.json ./
COPY projects/banner-data/ projects/banner-data/
COPY projects/common/ projects/common/

RUN yarn build

FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY --from=build /usr/src/app/projects/common/package.json /usr/src/app/projects/common/package.json
COPY --from=build /usr/src/app/projects/common/dist /usr/src/app/projects/common/dist

COPY --from=build /usr/src/app/projects/banner-data/package.json /usr/src/app/projects/banner-data/package.json
COPY --from=build /usr/src/app/projects/banner-data/dist /usr/src/app/projects/banner-data/dist

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --production

WORKDIR /usr/src/app/projects/banner-data

CMD ["npm", "start"]
