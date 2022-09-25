FROM arm32v7/node:14-buster as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM arm32v7/node:14-buster as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
ARG NEXT_PUBLIC_API_URL
RUN NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL npm run build

FROM arm32v7/node:14-buster as runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]