FROM node:20-bookworm-slim

WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl procps \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3333

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
