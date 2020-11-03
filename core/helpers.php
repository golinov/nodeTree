<?php

/**
 * Require a view.
 *
 * @param string $keyame
 * @param array $data
 */
function view($keyame, $data = [])
{
    extract($data);

    return require "app/views/{$keyame}.view.php";
}

/**
 * Redirect to a new page.
 *
 * @param string $path
 */
function redirect($path)
{
    header("Location: /{$path}");
}

function tree_obj($obj, $pid = 0)
{
    $out = [];
    foreach ($obj as $key => $value) {
        if ($value->pid == $pid) {
            $r = [
                'name' => $value->name,
                'id' => $value->id,
                'pid' => $value->pid
            ];
            unset($obj[$key]);
            $children = tree_obj($obj, $value->id);
            if (count($children) > 0) {
                $r['children'] = $children;
            }
            $out[] = $r;
        }
    }
    return $out;
}
