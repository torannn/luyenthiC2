# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# ---------- Stage 2: Runtime ----------
FROM node:18-alpine AS runner

LABEL com.centurylinklabs.watchtower.enable="true"

# Set the working directory
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001

# Copy only the necessary files from the builder stage
COPY --from=builder /app /app

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 3000

# Set environment variables
ARG GEMINI_API_KEY
ARG GROQ_API_KEY  
ARG OPENAI_API_KEY
ENV NODE_ENV=production
ENV GEMINI_API_KEY ${GEMINI_API_KEY}
ENV GROQ_API_KEY ${GROQ_API_KEY}
ENV OPENAI_API_KEY ${OPENAI_API_KEY}

# Run the app
CMD ["node", "server.js"]
