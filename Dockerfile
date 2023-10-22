# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Install nodemon globally
RUN npm install -g nodemon

# Expose port 3000 for the application
EXPOSE 3000

# Start the application using nodemon
CMD ["nodemon", "index.ts"]
