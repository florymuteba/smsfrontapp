#Dockerfile next_app
FROM node:18-alpine3.17

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
#RUN npm install
RUN npm install

# Bundle app source 
COPY . .

#RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "dev" ]

