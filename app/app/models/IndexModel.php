<?php


namespace App\Models;

use App\Core\App;
use PDO;

class IndexModel
{

    public static function getRoots()
    {
        $db = App::get('database');
        $sql = "SELECT * FROM tree JOIN tree_path USING (id)";
        $result = $db->prepare($sql);
        $result->execute();
        $roots = $result->fetchAll(PDO::FETCH_OBJ);
        return build_tree($roots);
    }

    public static function add($arr)
    {
        $data = [
            'name' => $arr['name'],
            'pid' => $arr['id'] ?? null
        ];
        $db = App::get('database');
        $sql = "INSERT INTO tree (name,pid) VALUES (:name,:pid)";
        $db->prepare($sql)->execute($data);
        $getRow = 'SELECT pid,name,path,id FROM tree JOIN tree_path USING (id) ORDER BY tree.id DESC LIMIT 1';
        $result = $db->prepare($getRow);
        $result->execute();
        if($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            $row['path'] = substr($row['path'],0,strlen($row['path'])-1);
            return $row;
        }
    }

    public static function edit($arr)
    {
        $db = App::get('database');
        $sql = "UPDATE tree SET name=:name WHERE id=:id";
        $stmt= $db->prepare($sql);
        $stmt->execute($arr);
    }

    public static function delete($id)
    {
        $db = App::get('database');
        $sql = "DELETE FROM tree WHERE id = :id";
        $result = $db->prepare($sql);
        $result->bindParam(':id', $id);
        $result->execute();
    }
}