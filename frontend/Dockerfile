FROM arm32v7/node:14-buster
ARG REACT_APP_API_URL

WORKDIR ./app

COPY package*.json ./
COPY . .

RUN npm install


EXPOSE 3000

CMD ["npm", "start"]