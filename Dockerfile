# Use an official Node.js image as the base image
FROM node:21-alpine3.18

# Define build arguments for environment variables

ARG VITE_API_URL
ARG VITE_API_KEY
# Set environment variables during the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_KEY=$VITE_API_KEY
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json to the container
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy the rest of the application code to the container
COPY . .
 
# Build the TypeScript code
RUN npm run build
 
# Expose the port that your React app will run on
EXPOSE 3000
 
# Define the command to run your application
CMD ["npm", "run", "start"]