FROM node:20-slim

# Set working directory
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Start your app
# Development
CMD ["npm", "run", "dev"]
# Production
# RUN npm run build
# CMD ["npm", "start"]
