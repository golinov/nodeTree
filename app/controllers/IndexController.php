<?php

namespace App\Controllers;

use App\Core\App;
use PDO;

class IndexController
{

    public function index()
    {
        return view('index');
    }

    public function getRoots()
    {
        $db = App::get('database');
        $sql = 'SELECT * from roots';
        $result = $db->prepare($sql);
        $result->execute();
        $roots = $result->fetchAll(PDO::FETCH_OBJ);
        echo json_encode(tree_obj($roots));
    }

    public function delete($id)
    {
        if(!empty($id))
        {
            $db = App::get('database');
            $sql = "DELETE FROM `roots` WHERE id = :id";
            $result = $db->prepare($sql);
            $result->bindParam(':id', $id);
            $result->execute();
        }
    }

    public function create()
    {
        $arr = array_filter($_POST);
        if(!empty($_POST['name'])) {
            $data = [
                'name' => $arr['name'],
                'pid' => $arr['pid'] ?? null
            ];
            $db = App::get('database');
            $sql = "INSERT INTO roots (name,pid) VALUES (:name,:pid)";
            $db->prepare($sql)->execute($data);
        }
    }

}
