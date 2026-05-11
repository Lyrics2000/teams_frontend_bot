FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set fund false \
    && npm config set audit false \
    && npm install --legacy-peer-deps --no-audit --no-fund

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]