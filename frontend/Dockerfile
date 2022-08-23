FROM arm32v7/node:14-buster
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR ./app

COPY package*.json ./


RUN npm ci

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start"]