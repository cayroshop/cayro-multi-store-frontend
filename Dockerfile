# syntax=docker/dockerfile:1.6

# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

ENV HUSKY=0 \
    NODE_ENV=production

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build

# ---------- Serve stage ----------
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
