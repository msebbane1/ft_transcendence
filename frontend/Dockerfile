FROM node:lts-alpine

#COPY ./     /app/
#RUN npm install -g react-scripts

#RUN rm -rf ./node_modules

#RUN npm install typescript --save-dev

#RUN rm -rf ./node_modules
#RUN rm ./package-lock.json ./yarn.lock
#RUN npm cache clear --force

#RUN npm install -g react-scripts typescript

WORKDIR /app

COPY package*.json ./

RUN yarn install


COPY . .

EXPOSE 3000

CMD ["yarn", "start"]

