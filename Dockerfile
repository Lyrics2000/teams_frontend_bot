FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

COPY package.json ./

RUN npm config set fund false \
    && npm config set audit false \
    && npm install --include=dev --legacy-peer-deps --no-audit --no-fund \
    && ls -la node_modules/.bin \
    && test -f node_modules/.bin/vite

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]