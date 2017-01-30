<?php
session_start();
set_time_limit(0);
error_reporting(E_ALL & ~E_NOTICE);
date_default_timezone_set("Asia/Calcutta");
define("PRACTICE_HEAD_EMAIL","parekh.manager@gmail.com");
define("TM_EMAIL","priyesh.mehta@infobeans.com");
define("LEAD_EMAIL","parakh.lead@gmail.com");
define("MANAGER_EMAIL","parekh.manager@gmail.com");
define("FROM_EMAIL","parakh.info@gmail.com");
//define("BCC_EMAIL","fatima.sayed@infobeans.com");

define("SITE_NAME","Parakh");
define("REMINDER_1_ADD_REASON_DAYS","5");
//define("REMINDER_2_ADD_REASON_DAYS","5");
define("REVERT_RATING_DAY_LIMIT","10");
 
define("ENVIRONMENT","LOCAL") ; //Values= LOCAL, QA, LIVE-QA, LIVE

$port="";
if(isset($_SERVER['HTTP_HOST']))
{
	$http_port = explode(':',$_SERVER['HTTP_HOST']);
        $port=(!empty($http_port[1])) ? ":".$http_port[1]."/" : "/";
}

if(ENVIRONMENT=="LOCAL")
{

   
  define("SITE_URL","http://localdev.parakh.com".$port);
  define("FROM_NAME","PARAKH-LOCAL SITE");
  define("GOOGLE_REDIRECT_URL","http://dev.parakh.com".$port);
  define("DB_HOST","localhost");
  define("DB_USERNAME","root");
  define("DB_PASSWORD","root");
  define("DB_NAME","review_system_v3");
  define("REL_PATH","./");
} 
else if(ENVIRONMENT=="QA")
{
  define("SITE_URL","http://qa.parakh.com".$port);
  define("FROM_NAME","PARAKH-QA SITE");
  define("GOOGLE_REDIRECT_URL","http://qa.parakh.com".$port);
  
  define("DB_HOST","localhost");
  define("DB_USERNAME","root");
  define("DB_PASSWORD","root");
  define("DB_NAME","review_system_v2");
  define("REL_PATH","/var/www/html/rating_qa/trunk/");
}
else if(ENVIRONMENT=="LIVE-QA")
{    
  define("SITE_URL","http://parakh.infobeans.com".$port);
  define("FROM_NAME","PARAKH-LIVE-QA SITE");
  define("GOOGLE_REDIRECT_URL","http://parakh.infobeans.com".$port);
  
  define("DB_HOST","localhost");
  define("DB_USERNAME","root");
  define("DB_PASSWORD","root");
  define("DB_NAME","review_system_v2");
  define("REL_PATH","/var/www/html/rating/trunk/");
}
else if(ENVIRONMENT=="LIVE")
{    
  define("SITE_URL","http://parakh.infobeans.com".$port);
  define("FROM_NAME","PARAKH-THE REVIEW SYSTEM");
  define("GOOGLE_REDIRECT_URL","http://parakh.infobeans.com".$port);
  
  define("DB_HOST","localhost");
  define("DB_USERNAME","root");
  define("DB_PASSWORD","root");
  define("DB_NAME","review_system_v3");
  define("REL_PATH","/var/www/html/rating/trunk/");
}
/* Check Session *
define("Pending","Pending");
define("Deny","Deny");
define("Accepted","Accepted");
$status_flag = array("Pending","Declined","Accepted/Rated");
$current_page_name =  basename($_SERVER['PHP_SELF']);

/* Page Title Array */
$page_title = array();
$page_title["profile.php"] = "My Profile";
$page_title["manager_work_rating.php"] = "Rate Me";
$page_title["manager_work.php"] = "Rate a Team Member";
/*$page_title["manager_work_list_page.php"] = "My Request <span class='badge'>$unread_count</span>";*/
$page_title["manager_work_list_page.php"] = "Requests";
$page_title["work_list_tab1.php"] = "Work List Inbox";
$page_title["work_list.php"] = "Work List";
$page_title["work_list_tab2.php"] = "Work List Outbox";
$page_title["view_request_work.php"] = "View Request";
$page_title["view_request.php"] = "View Request";
$page_title["view_all_send_request.php"] = "View Request";
$page_title["request.php"] = "Rate Me";
$page_title["view_direct_request.php"] = "View Rating";
//$page_title["rating_dashboard.php"] = "Rating Dashboard";
$page_title["add_user.php"] = "Add User";
$page_title["give_rating.php"] = "Give Rating";
$page_title["view_review_outbox_detail.php"] = "View Detail";
$page_title["give_rating_outbox.php"] = "Give Rating";
$page_title["user_list_page.php"] = "User List";
$page_title["assigned_role.php"] = "Update Details";
$page_title["add_user.php"] = "Add User";
$page_title["edit_profile.php"] = "Edit Profile";
$page_title["edit_work.php"] = "Edit Work";

$activePage = basename($_SERVER['PHP_SELF']);
$set_page_title = '';
if(array_key_exists($activePage, $page_title)) {
    $set_page_title =  $page_title[$activePage];
}
else {
    $set_page_title = '';
}


$errors = array (
    1 => "You do not have a Lead/Manager assigned. Please contact the Administrator.",
    2 => "You do not have a Lead/Manager assigned. Please contact the Administrator.",
    3 => "Profile updated successfully.",
    4 => "Please fill the required fields.",
    5 => "Your request has been sent successfully.",
    6 => "Rating saved successfully.",
    7 => "User details updated successfully.",
    8 => "User added successfully.",
    9 => "Your account has not been activated. Please contact the Administrator.",
    10 => "Status updated successfully.",
    11 => "User already exists.",
    12 => "Rating submitted successfully.",
    13 => "Rating saved successfully.",
    14 => "Please provide a reason for your rating.",
    15 => "Please provide appropriate reason for your rating request.",
    16 => "Rating request approved!",
    17 => "Rating request declined!",
    18 => "Rating submitted successfully.",
    19 => "You were not privileged to access profile page for given member.",
    20 => "Oops, Something went wrong, contact site administrator"
);

if($activePage!=="index.php")
{
    if(!isset($_SESSION['userinfo']) && empty($_SESSION['userinfo'])) {
        if($activePage == "admin.php") {

        }
        else {
        header('Location: index.php');
        }
    }
}
