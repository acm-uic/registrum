FROM node:14-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY projects/api/package.json projects/api/
COPY projects/common/package.json projects/common/

RUN yarn --pure-lockfile --non-interactive

COPY lerna.json ./
COPY projects/api/ projects/api/
COPY projects/common/ projects/common/

RUN yarn build

FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY --from=build /usr/src/app/projects/common/package.json /usr/src/app/projects/common/package.json
COPY --from=build /usr/src/app/projects/common/dist /usr/src/app/projects/common/dist

COPY --from=build /usr/src/app/projects/api/package.json /usr/src/app/projects/api/package.json
COPY --from=build /usr/src/app/projects/api/dist /usr/src/app/projects/api/dist

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --production

WORKDIR /usr/src/app/projects/api

CMD ["npm", "start"]
