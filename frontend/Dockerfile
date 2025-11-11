# Використовуємо легкий Nginx
FROM nginx:alpine

# Копіюємо нашу конфігурацію nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копіюємо фронтенд файли
COPY . /usr/share/nginx/html

# Порт для Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

