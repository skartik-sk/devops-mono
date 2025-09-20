FROM oven/bun:1-alpine

WORKDIR /usr/src/app

COPY ./package.json ./package.json
COPY ./bun.lock ./bun.lock
COPY ./packages ./packages
COPY ./turbo.json ./turbo.json
COPY ./apps/socket/package.json ./apps/socket/package.json


RUN bun install
COPY ./apps/socket ./apps/socket
RUN bun run db:generate

EXPOSE 8081

CMD ["bun", "run", "start:socket"]

  