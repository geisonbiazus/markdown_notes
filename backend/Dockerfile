# docker build .  -t geisonbiazus/markdown_notes:alpha

FROM node:14.5.0-alpine as builder
ENV NODE_ENV=production

WORKDIR /app

ADD . .

RUN npm ci
RUN npm run build


FROM node:14.5.0-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/build .

CMD ["node", "index.js"]
