<?php 
require_once dirname(__FILE__) . '/dbmodule.php';
$db = new dbmodule();

$db->get_last_month_login_users();
