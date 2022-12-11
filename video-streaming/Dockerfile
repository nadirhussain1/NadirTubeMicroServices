FROM node:19.1.0-alpine

ENV PORT 3000

WORKDIR /Users/nadirhussain/NadirTubeMicroServices
COPY package*.json ./
RUN npm install --only=production
COPY ./src ./src
COPY ./videos ./videos
CMD npm start