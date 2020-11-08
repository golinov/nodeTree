<?php


namespace App\Controllers;


use App\Models\IndexModel;

class IndexController
{

    public function index()
    {
        return view('index');
    }

    public function getRoots()
    {
        echo json_encode(IndexModel::getRoots());
    }

    public function delete($id)
    {
        if(!empty($id))
        {
            IndexModel::delete($id);
        }
    }

    public function create()
    {
        $arr = array_filter($_POST);
        if(!empty($_POST['name'])) {
            echo json_encode(IndexModel::add($arr));
        }
    }

    public function edit()
    {
        $arr = array_filter($_POST);
        echo json_encode($arr);
        if(!empty($_POST['name'])) {
            echo json_encode(IndexModel::edit($arr));
        }
    }
}
