# syntax=docker/dockerfile:1.6

# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Do not set NODE_ENV=production before `npm ci` — npm omits devDependencies
# (vite, plugins, types) and the build fails. Enable production for Vite only
# when running the build.
ENV HUSKY=0

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

ENV NODE_ENV=production
RUN npm run build

# ---------- Serve stage ----------
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
