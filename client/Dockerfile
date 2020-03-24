FROM node:12-buster AS base
ENV PATH=$PATH:/usr/src/app/node_modules/.bin
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as dev
ENV NODE_ENV=development \
    CHOKIDAR_USEPOLLING=true \
    BROWSER=none \
    API_URL=http://api:4000
RUN npm install
EXPOSE 3000
CMD npm run start

FROM base as build
ENV CI=true
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build --if-present

FROM nginx:alpine as prod
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /use/src/app/build /usr/share/nginx/html
