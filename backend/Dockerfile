# Stage 1: Base Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# App runs on port 5000
EXPOSE 5000

# Command to start the server
CMD ["npm", "start"]
