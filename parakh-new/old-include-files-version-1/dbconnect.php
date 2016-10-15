<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class dbconnect {
    //Variable to store database connection
    private $con;
        
    //Class constructor
    function __construct()
    {
        // empty
    }
    
    //This method will connect to the database
    function connect()
    {
        //Including the constants.php file to get the database constants
        include_once dirname(__FILE__) . '/constants.php';
        
        $this->con = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME, DB_USERNAME, DB_PASSWORD,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));            
        $this->con->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_NATURAL);
        //finally returning the connection link 
        return $this->con;
    }
}