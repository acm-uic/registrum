FROM node:12-buster AS base
ENV PATH=$PATH:/usr/src/app/node_modules/.bin \
    NODE_ENV=development \
    CI=true
RUN apt-get update && \ 
    apt-get -y install \
    libxi6 \
    libgl1-mesa-glx
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base as dev
EXPOSE 3000
CMD npm run start

FROM base as build
COPY . .
RUN npm run build --if-present

FROM nginx:alpine as prod
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
