<?php

use App\Core\App;
use App\Core\Database\Connection;

$config = [
    'name' => getenv('DB_NAME'),
    'username' => getenv('DB_USER'),
    'password' => getenv('DB_PASSWORD'),
    'host' => getenv('DB_HOST'),
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]
];

App::bind('config', $config);

App::bind('database', Connection::make(App::get('config')));