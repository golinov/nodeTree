FROM php:8.0-fpm-alpine3.13

# Install system dependencies
RUN set -xe \
    && apk update \
    && apk upgrade \
    && docker-php-ext-install pdo_mysql \
    && apk add --no-cache \
    && apk add git curl wget nano \
    && apk del --no-cache --no-network


# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /www/app

CMD ["php-fpm"]