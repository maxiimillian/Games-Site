FROM arm32v7/node:16-buster
LABEL authors="maxiimillian"

WORKDIR ./app

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 3001

CMD ["node", "index.js"]