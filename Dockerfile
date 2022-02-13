FROM node:12-alpine as node

EXPOSE 4200

WORKDIR /app

COPY package.json /app/

RUN npm i npm@latest -g && npm install

COPY ./ /app/

ARG env=prod

#RUN npm run build
