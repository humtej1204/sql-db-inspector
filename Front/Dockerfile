# ---------- Build ----------
FROM node:20-bookworm AS builder
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build

# Copia artefacto final a /app/www (aplanado)
RUN set -eux; \
    APP_DIR="$(ls -1 dist | head -n1)"; \
    echo "Detected APP_DIR=${APP_DIR}"; \
    mkdir -p /app/www; \
    if [ -d "dist/${APP_DIR}/browser" ]; then \
      cp -R "dist/${APP_DIR}/browser/." /app/www; \
    else \
      cp -R "dist/${APP_DIR}/." /app/www; \
    fi

# ---------- Runtime ----------
FROM nginx:1.27-alpine AS runtime
COPY .deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/www /usr/share/nginx/html/

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]