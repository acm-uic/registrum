FROM node:12-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as build
RUN npm ci
COPY . .
RUN  npm run build --if-present

FROM base as release
RUN npm install --production
COPY --from=build /usr/src/app/dist /usr/src/app/dist
ENV PORT=8080
EXPOSE 8080
CMD npm run start