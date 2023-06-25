FROM node:18.12.1
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 8030
CMD ["npm", "run", "dev"]