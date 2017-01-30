<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function makeResponse($error_status,$data){
    return array('error' => $error_status,'data'=>$data);
}

function validateSecretKey($key)
{
    require_once 'constants.php';

    if($key === SALT){
        return true;
    }else{
        return false;
    }
}
