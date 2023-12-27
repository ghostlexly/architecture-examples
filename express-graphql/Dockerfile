# -- BUILDER
FROM node:18.16.0-alpine3.17 as builder
WORKDIR /usr/src/app

# Install dependencies
RUN apk update && apk add --no-cache openssl procps
COPY . .
RUN yarn install

# Build project
RUN yarn build
RUN yarn prisma generate

# Clear dev dependencies
RUN yarn install --production --ignore-optional

# -- RUNNER
FROM node:18.16.0-alpine3.17 AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN apk update && apk add --no-cache openssl procps chromium

# Copy dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY ./package.json ./

# Copy project specific files
COPY --from=builder /usr/src/app/dist ./dist
COPY ./prisma ./prisma

CMD yarn start
