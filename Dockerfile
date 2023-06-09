FROM node:18.15.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g sequelize-cli forever sequelize-auto pg-core

RUN npm -f install

COPY . /app

EXPOSE 8080

RUN mkdir -p $(eval echo ~$USER)/.forever
RUN ln -sf /dev/stdout $(eval echo ~$USER)/.forever/api_out.log

ENV NODE_ENV development

CMD ["npm", "run", "dev"]
