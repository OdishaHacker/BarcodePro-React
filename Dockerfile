# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy all source files and build
COPY . .
RUN npm run build

# Production Stage (Nginx)
FROM nginx:alpine

# Copy built assets from the build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

# Optimized for Lightweight & Fast Performance
