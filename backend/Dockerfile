FROM arm32v7/node:16-buster

ARG DB_PATH
ARG BOARD_DB_PATH
ARG ALLOWED_URL

ENV DB_PATH=$DB_PATH
ENV BOARD_DB_PATH=$BOARD_DB_PATH
ENV ALLOWED_URL=$ALLOWED_URL

LABEL authors="maxiimillian"

WORKDIR ./app

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 3001


CMD ["node", "index.js"]