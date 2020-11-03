<?php

$router->get('', 'IndexController@index');
$router->get('getRoots', 'IndexController@getRoots');
$router->get('delete/{$id}', 'IndexController@delete');
$router->post('create', 'IndexController@create');