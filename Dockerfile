FROM node:latest

# Start at /app
WORKDIR /app

# Copy everything
COPY . .

# Change working directory to backend
WORKDIR /app/backend

# Install and run inside backend folder
RUN npm install

CMD ["npm", "start"]

