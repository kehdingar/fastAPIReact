FROM node:alpine3.16 AS build

WORKDIR /app

COPY package.json /package.json

COPY . /app

RUN yarn install

RUN yarn run build

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin

