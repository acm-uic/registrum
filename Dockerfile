FROM node:12-alpine as api
ENV NODE_ENV=production
WORKDIR /usr/src/app/api

COPY --from=registrum_base /usr/src/app/api/package.json .
RUN npm install --production
COPY --from=registrum_base /usr/src/app/api/dist dist

ENTRYPOINT [ "npm", "run", "start" ]


FROM node:12-alpine as banner
ENV NODE_ENV=production
WORKDIR /usr/src/app/banner

COPY --from=registrum_base /usr/src/app/banner/package.json .
RUN npm install --production
COPY --from=registrum_base /usr/src/app/banner/dist dist

ENTRYPOINT [ "npm", "run", "start" ]


FROM node:12-alpine as banner-data
ENV NODE_ENV=production
WORKDIR /usr/src/app/banner

COPY --from=registrum_base /usr/src/app/banner/package.json .
COPY --from=registrum_base /usr/src/app/banner/dist dist
RUN npm link

WORKDIR /usr/src/app/banner-data
COPY --from=registrum_base /usr/src/app/banner-data/package.json .
RUN npm link registrum-banner
RUN npm install --production
COPY --from=registrum_base /usr/src/app/banner-data/dist dist

ENTRYPOINT [ "npm", "run", "start" ]


FROM nginx:alpine as client

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=registrum_base /usr/src/app/client/dist /usr/share/nginx/html
