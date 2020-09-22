# docker build .  -t geisonbiazus/markdown_notes_frontend:alpha

FROM node:14.5.0-alpine as builder
ENV NODE_ENV=production

WORKDIR /app

ADD . .

RUN npm ci
RUN npm run build


FROM node:14.5.0-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/build build
COPY --from=builder /app/server.js .

RUN npm install express

CMD ["node", "server.js"]