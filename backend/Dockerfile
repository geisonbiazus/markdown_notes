# docker build .  -t geisonbiazus/markdown_notes:alpha

FROM node:14.5.0-alpine
ENV NODE_ENV=production

WORKDIR /app

ADD . .

RUN npm ci
RUN npm run build

CMD ["node", "build/index.js"]
