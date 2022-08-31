FROM node:16.10.0
ENV NODE_OPTIONS=--max_old_space_size=2048
WORKDIR /usr/src/app

RUN npm install -g npm@8.18.0
RUN npm install -g ts-node

COPY BACK/package*.json ./BACK/
COPY FRONT/package.json ./FRONT/
COPY package.json .

RUN npm run install:front
RUN npm run install:back

COPY . .
CMD ["npm", "run", "run:all"]
