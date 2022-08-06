# Base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

# Bundle app source
COPY . .

EXPOSE 3000

# Creates a "dist" folder with the production build
RUN yarn run build

# Start the server using the production build
CMD ["node", "dist/app.js"]