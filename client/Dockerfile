FROM node:12-buster AS base
ENV PATH=$PATH:/usr/src/app/node_modules/.bin
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as deps
RUN apt-get update && \ 
    apt-get -y install \
    libglu1 \
    libxi6 \
    libgconf-2-4

FROM deps as dev
ENV NODE_ENV=development
RUN npm install
EXPOSE 3000
CMD npm run start

FROM deps as build
ENV CI=true
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build --if-present

FROM nginx:alpine as prod
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
