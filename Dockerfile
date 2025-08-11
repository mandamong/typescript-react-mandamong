FROM nginx:stable-alpine AS production

RUN mkdir -p /var/www/html/mandamong

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY dist /var/www/html/mandamong

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
