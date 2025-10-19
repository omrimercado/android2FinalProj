FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy source code
COPY . .

# Expose port 3000 for React development server
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]

