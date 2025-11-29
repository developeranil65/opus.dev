# Stage 1: Build the React App
FROM node:18-alpine as builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built "dist" folder from the previous stage to Nginx's html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (we will create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the internal Docker network
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]