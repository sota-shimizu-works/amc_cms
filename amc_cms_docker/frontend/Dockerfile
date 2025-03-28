FROM node:20.11.1-alpine

WORKDIR /usr/src/app

RUN apk upgrade --no-cache && \
    apk add --update --no-cache \
    postgresql-client curl git