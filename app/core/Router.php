<?php

namespace App\Core;

use Exception;

class Router
{
    /**
     * All registered routes.
     *
     * @var array
     */
    public $routes = [
        'GET' => [],
        'POST' => []
    ];

    /**
     * Load a user's routes file.
     *
     * @param string $file
     */
    public static function load($file)
    {
        $router = new static;

        require $file;

        return $router;
    }

    /**
     * Register a GET route.
     *
     * @param string $uri
     * @param string $controller
     */
    public function get($uri, $controller)
    {
        $this->routes['GET'][$uri] = $controller;
    }

    /**
     * Register a POST route.
     *
     * @param string $uri
     * @param string $controller
     */
    public function post($uri, $controller)
    {
        $this->routes['POST'][$uri] = $controller;
    }

    /**
     * Load the requested URI's associated controller method.
     *
     * @param string $uri
     * @param string $requestType
     * @throws Exception
     */
    public function direct($uri, $requestType)
    {
        foreach ($this->routes[$requestType] as $key => $value)
        {
            $segments = explode('/',$key);
            $routes[$segments[0]] = $value;
        }
        $uri = explode('/', $uri);
        $params = $uri[1] ?? false;
        if (array_key_exists($uri[0], $routes)) {
            $segments = explode('@',$routes[$uri[0]]);
            $controller = $segments[0];
            $action = $segments[1];
            return $this->callAction(
                $controller,$action, $params ?? false
            );
        }

        throw new Exception('No route defined for this URI.');
    }

    /**
     * Load and call the relevant controller action.
     *
     * @param string $controller
     * @param string $action
     * @param bool $params
     * @return mixed
     * @throws Exception
     */
    protected function callAction($controller, $action, $params = false)
    {
        $controller = "App\\Controllers\\{$controller}";
        $controller = new $controller;

        if (!method_exists($controller, $action)) {
            throw new Exception(
                "{$controller} does not respond to the {$action} action."
            );
        }
        return $controller->$action($params);
    }
}
