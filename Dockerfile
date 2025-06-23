FROM node:iron-alpine3.22 AS build_image

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --omit=dev

FROM node:iron-alpine3.22

WORKDIR /usr/src/app

COPY --from=build_image /usr/src/app/dist ./dist
COPY --from=build_image /usr/src/app/node_modules ./node_modules

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]