FROM node:12-buster AS base
ENV PATH=$PATH:/home/node/app/node_modules/.bin
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as dev
ENV NODE_ENV=development \
    PORT=4000
RUN npm install
EXPOSE 4000
CMD npm run watch

FROM base as build
ENV NODE_ENV=production
RUN npm ci
COPY . .
RUN  npm run build --if-present

FROM node:12-alpine as prod
COPY --from=build /usr/src/app/package*.json /usr/src/app/
RUN npm install --production
COPY --from=build /usr/src/app/dist /usr/src/app/dist
ENV PORT=8080
EXPOSE 8080
CMD npm run start