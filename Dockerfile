# Build stage
FROM node:18-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using pnpm
RUN pnpm install

# Copy source code
COPY . .

# Build the Nest.js application
RUN pnpm run build


# Production stage
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set NODE_ENV to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy only production dependencies and build output from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Install only production dependencies
RUN pnpm install --only=production

# Remove development dependencies
RUN rm package*.json

# Expose port 8888
EXPOSE 4200 8889 8888

# Command to start the application
CMD [ "node", "dist/main.js" ]
