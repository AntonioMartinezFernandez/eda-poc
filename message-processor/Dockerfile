FROM node:18.12.1-alpine3.17
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 8010
CMD ["npm", "run", "dev"]