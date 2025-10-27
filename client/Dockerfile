# --- STAGE 1: Build the React App ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client source code
COPY . .

# Build the production app
RUN npm run build

# --- STAGE 2: Serve with Nginx ---
FROM nginx:stable-alpine

# Copy the built files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove the default Nginx config and add our custom config
RUN rm -f /etc/nginx/conf.d/default.conf
# The project contains a custom nginx config file named `ngnix.config` (note the spelling).
# Copy it to Nginx as the default site config.
COPY ngnix.config /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
