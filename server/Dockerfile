FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production || npm install

COPY . .

# Expose port 3001 for both HTTP API and WebSocket
EXPOSE 3001

# Use npm start for production, or override with npm run dev for development
CMD ["npm", "start"]
