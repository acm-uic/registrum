FROM registrum_base as api
ENV NODE_ENV=production
WORKDIR /usr/src/app/api
ENTRYPOINT [ "rushx", "start" ]

FROM registrum_base as banner
ENV NODE_ENV=production
WORKDIR /usr/src/app/banner
ENTRYPOINT [ "rushx", "start" ]

FROM registrum_base as banner-data
ENV NODE_ENV=production
WORKDIR /usr/src/app/banner-data
ENTRYPOINT [ "rushx", "start" ]

FROM nginx:alpine as client
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=registrum_base /usr/src/app/client/dist /usr/share/nginx/html
