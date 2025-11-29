FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies (including devDependencies to build TS)
RUN npm install

COPY . .

# Build the TypeScript code
RUN npm run build

EXPOSE 3000

# Run the COMPILED file from dist/
CMD [ "node", "dist/server.js" ]