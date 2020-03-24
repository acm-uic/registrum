FROM node:12-buster AS base
ENV PATH=$PATH:/usr/src/app/node_modules/.bin
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as dev
ENV NODE_ENV=development \
    PORT=4000
RUN npm install
EXPOSE 4000
CMD npm run watch

FROM base as build
RUN npm ci
COPY . .
RUN npm run build

FROM node:12-alpine as prod
ENV NODE_ENV=production
COPY --from=build /usr/src/app/package*.json ./
RUN npm install --production
COPY --from=build /usr/src/app/dist ./
ENV PORT=8080
EXPOSE 8080
CMD npm run start