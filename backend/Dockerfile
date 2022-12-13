FROM node:16 as dependencies

LABEL authors="maxiimillian"

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:16 as runner
ARG DB_PATH
ARG BOARD_DB_PATH
ARG ALLOWED_URL
ARG PORT

ENV DB_PATH=$DB_PATH
ENV BOARD_DB_PATH=$BOARD_DB_PATH
ENV ALLOWED_URL=$ALLOWED_URL
ENV PORT=$PORT

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
EXPOSE 3002

CMD ["node", "index.js"]