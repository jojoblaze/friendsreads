FROM node

WORKDIR /usr/src/api

COPY dist/api/ ./
COPY package*.json ./

RUN npm install

EXPOSE 8000

CMD ["node", "server.js"]