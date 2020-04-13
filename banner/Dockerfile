FROM node:12-buster AS base
ENV PATH=$PATH:/usr/src/app/node_modules/.bin \
    BANNER_PORT=4001
EXPOSE 4001

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base as dev
CMD npm run watch

FROM base as build
COPY . .
RUN npm run build

FROM node:12-alpine as prod
ENV NODE_ENV=production
COPY --from=build /usr/src/app/package*.json ./
RUN npm install --production
COPY --from=build /usr/src/app/dist ./dist
CMD npm run start
