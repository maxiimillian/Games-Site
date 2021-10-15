FROM arm32v7/node:14-buster
LABEL authors="maxiimillian"

WORKDIR ./app

COPY package*.json ./

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update && apt-get install -y nodejs

RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]