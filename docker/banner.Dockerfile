FROM node:15-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY projects/banner/package.json projects/banner/
COPY projects/common/package.json projects/common/

RUN yarn --pure-lockfile --non-interactive

COPY lerna.json ./
COPY projects/banner/ projects/banner/
COPY projects/common/ projects/common/

RUN yarn build

FROM node:15-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY --from=build /usr/src/app/projects/common/package.json /usr/src/app/projects/common/package.json
COPY --from=build /usr/src/app/projects/common/dist /usr/src/app/projects/common/dist

COPY --from=build /usr/src/app/projects/banner/package.json /usr/src/app/projects/banner/package.json
COPY --from=build /usr/src/app/projects/banner/dist /usr/src/app/projects/banner/dist

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --production

WORKDIR /usr/src/app/projects/banner

CMD ["npm", "start"]
