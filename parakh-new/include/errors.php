<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function get_site_error($error_code){
    
switch ($error_code) {
    case 3001:
        return array(
        'code' => '3001',
        'error' => 'Either invalid email or email is not exists'
        );
        break;
    case 3002:
        return array(
        'code' => '3002',
        'error' => 'invalid user id'
        );
        break;
    case 3003:
        return array(
        'code' => '3003',
        'error' => 'Unauthorized access'
        );
        break;
    case 3004:
        return array(
        'code' => '3004',
        'error' => 'Invalid parameter for rating'
        );
        break;
    case 3005:
        return array(
        'code' => '3005',
        'error' => 'Invalid parameter for profile update'
        );
        break;
    case 3006:
        return array(
        'code' => '3006',
        'error' => 'Member is not belong to you team'
        );
        break;
    case 3007:
        return array(
        'code' => '3007',
        'error' => 'Invalid parameter for profile create'
        );
        break;
    case 3008:
        return array(
        'code' => '3008',
        'error' => 'Invalid parameter for Feedback'
        );
        break;
    case 3009:
        return array(
        'code' => '3009',
        'error' => 'Invalid user or no record found'
        );
        break;
    case 3010:
        return array(
        'code' => '3010',
        'error' => 'Invalid parameter for request'
        );
        break;
    case "blue":
        echo "Your favorite color is blue!";
        break;
    case "green":
        echo "Your favorite color is green!";
        break;
    default:
        return array(
        'code' => '0000',
        'error' => 'Unhandled error'
        );
}
       
}