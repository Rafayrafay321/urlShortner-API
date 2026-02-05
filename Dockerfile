# Start with Base Image of NODE
FROM node:alpine

# Set the "home base" inside the container
WORKDIR /app

# Copy files from my local folder into the /app folder
COPY package*.json ./

# Run command inside /app
RUN npm install

# Copy remaining files
COPY . .

# Compile .ts files
RUN npm run build

# Exposing PORT
EXPOSE 3000

# Start the application using the compiled javascript
CMD ["node","dist/server.js"]