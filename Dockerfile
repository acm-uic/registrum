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
