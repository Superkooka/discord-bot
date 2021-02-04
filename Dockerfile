FROM node:alpine

WORKDIR /app

RUN npm i

CMD ["npm", "run", "bot"]