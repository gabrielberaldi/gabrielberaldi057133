ARG NODE_VERSION=20.19.0
ARG NGINX_VERSION=alpine3.22

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY package.json *package-lock.json* ./

RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build --configuration=production

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

USER root 
RUN apk add --no-cache curl

COPY nginx.conf /etc/nginx/nginx.conf

COPY --chown=nginx:nginx --from=builder /app/dist/gabrielberaldi057133/browser /usr/share/nginx/html

USER nginx
EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
