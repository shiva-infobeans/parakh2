<?php
if($_SERVER['HTTP_HOST']=='dev.parakh.com'){
	//Constants to connect with the local database
	define('DB_USERNAME', 'root');
	define('DB_PASSWORD', 'root');
	define('DB_HOST', 'localhost');
	define('DB_NAME', 'parakh-local');
	define('SALT', 'parakh-revamp-local-key-2016');
}else if($_SERVER['HTTP_HOST']=='dev.parakhnewdesign.com'){
{
	//Constants to connect with the dev database
	define('DB_USERNAME', 'root');
	define('DB_PASSWORD', 'InfoBeans@2015');
	define('DB_HOST', 'localhost');
	define('DB_NAME', 'parakh-newdesign-dev');
	define('SALT', 'parakh-revamp-qa#key!2016');
}
}else if($_SERVER['HTTP_HOST']=='qa.parakhnewdesign.com'){
{
	//Constants to connect with the qa database
	define('DB_USERNAME', 'root');
	define('DB_PASSWORD', 'InfoBeans@2015');
	define('DB_HOST', 'localhost');
	define('DB_NAME', 'parakh-newdesign-qa');
	define('SALT', 'parakh-revamp-qa#key!2016');
}
}
