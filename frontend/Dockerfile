FROM node:lts-alpine

#COPY ./     /app/
RUN npm install typescript --save-dev

RUN npm install -g react-scripts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

