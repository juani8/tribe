FROM node:20-alpine

# ── Metadata ──────────────────────────────────────────────────────────────────
LABEL maintainer="juani8" \
      app="tribe-backend" \
      description="Tribe Backend API"

# ── Security: non-root user ──────────────────────────────────────────────────
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# ── Working directory ─────────────────────────────────────────────────────────
WORKDIR /app

# ── Dependencies (cached layer) ──────────────────────────────────────────────
COPY TribeBackend/package.json TribeBackend/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# ── Application code ─────────────────────────────────────────────────────────
COPY TribeBackend/ .

# ── Drop privileges ──────────────────────────────────────────────────────────
USER appuser

# ── Expose & run ─────────────────────────────────────────────────────────────
EXPOSE 8080
ENV NODE_ENV=Production
CMD ["node", "server/index.js"]
