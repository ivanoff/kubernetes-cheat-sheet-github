FROM oven/bun:latest

WORKDIR /app

COPY ./api /app

RUN bun i

CMD ["bun", "--watch", "src/index.ts"]
