<?php

namespace App\Core\Database;

use PDO;
use PDOException;

class Connection
{
    /**
     * Create a new PDO connection.
     *
     * @param array $config
     * @return PDO
     */
    public static function make(array $config): PDO
    {
        try {
            return new PDO(
                'mysql:host='.$config['host'].';dbname='.$config['name'],
                $config['username'],
                $config['password'],
                $config['options']
            );
        } catch (PDOException $e) {
            die($e->getMessage());
        }
    }
}
