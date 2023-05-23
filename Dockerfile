################################################################################
# Web Application Docker image
#
# Author: Miltiadis Koutsokeras <miltos@langaware.com>
#
# See README.md for detailed instructions on how to use this file.
#
################################################################################

# Install dependencies only when needed
FROM node:16-alpine AS deps

# Install Alpine packages
# To understand why libc6-compat might be needed, check:
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

# Working directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json .
RUN npm ci

################################################################################
# Rebuild the source code only when needed
FROM node:16-alpine AS builder

# Working directory
WORKDIR /app

# Copy from dependencies prepared files
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY . .

# If using npm comment out above and use below instead
RUN npm run build

################################################################################
# Production image, copy all the files and run next
FROM node:16-alpine AS runner

# Image Build arguments
ARG GIT_HASH 'NA'
ARG GIT_BRANCH 'NA'

# Add system user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy from builder prepared files
# Public files
COPY --from=builder /app/public /app/public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone /app/
# Static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/static /app/.next/static

# User to run all commands as
USER nextjs

# Working directory
WORKDIR /app

# Environment variables
ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1
ENV BROWSER none
ENV FAST_REFRESH true
ENV COOKIE_USER_STATE_NAME nextjs_issue_48539
ENV COOKIE_USER_STATE_SECRET ACDEFGHIJKLMNOPQRSTUVWXYZ0123456
ENV SECURE_COOKIES true

# Exposed ports
EXPOSE 3000

# Container command
CMD ["node", "server.js"]
