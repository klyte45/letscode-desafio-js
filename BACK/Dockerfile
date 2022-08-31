FROM node:16.10.0
WORKDIR /usr/src/app

RUN npm install -g npm@8.18.0
RUN npm install -g ts-node

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run test
CMD ["npm", "run", "start"]
