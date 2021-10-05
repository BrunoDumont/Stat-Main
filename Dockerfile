FROM node:12-alpine as builder
WORKDIR /app
COPY . /app
RUN npm i
RUN npm run build

FROM nginx:1.16.0-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]