FROM node:latest

LABEL version="1.0"
LABEL description="Visualer client"
LABEL maintainer = "avihay@three-dev.com"

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3006
CMD ["npm", "start"]