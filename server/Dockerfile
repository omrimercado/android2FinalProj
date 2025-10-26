FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install -g yarn && \
    yarn install --frozen-lockfile || yarn install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
