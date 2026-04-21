# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Angular app
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/dist/student-portal /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
