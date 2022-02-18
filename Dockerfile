FROM node:14-alpine as node

EXPOSE 4200

WORKDIR /app

COPY package.json /app/

RUN npm i npm@latest -g && npm install

COPY ./ /app/

ARG env=prod

CMD npm run build
