FROM arm32v7/node:14-buster
LABEL authors="maxiimillian"

WORKDIR ./app

COPY package*.json ./


RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]