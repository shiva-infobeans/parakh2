<?php

/**
 * Step 1: Require the Slim Framework using Composer's autoloader
 *
 * If you are not using Composer, you need to load Slim Framework with your own
 * PSR-4 autoloader.
 */

define('DEBUG_MODE','OFF');
if(DEBUG_MODE=='OFF') {
ini_set("display_errors",0);
error_reporting(0);
}
else if(DEBUG_MODE=='ON')
{
   ini_set("display_errors",1);
   error_reporting(E_ALL);
}
require '../vendor/autoload.php';

/**
 * Step 2: Instantiate a Slim application
 *
 * This example instantiates a Slim application using
 * its default settings. However, you will usually configure
 * your Slim application now by passing an associative array
 * of setting names and values into the application constructor.
 */
$config = [ 'settings' => [ 'addContentLengthHeader' => false, ] ];
$app = new Slim\App($config);

/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, `Slim::patch`, and `Slim::delete`
 * is an anonymous function.
 */

require_once '../include/dbmodule.php';
require_once '../include/functions.php';
require_once '../include/errors.php';


$app->add(function ($request, $response, $next) {
	
        $headers = $request->getHeaders();
        // Validate headers
        if(trim($headers['HTTP_SECRET'][0]) != "" && validateSecretKey($headers['HTTP_SECRET'][0])){
            $response = $next($request, $response);
			$size = (int)$response->getBody()->getSize();		
        }else{
            $response_data = makeResponse('true',get_site_error(3003));
            $response->withJson($response_data);
        }
	//$response->getBody()->write('AFTER');
	return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getUserByEmail/<email>
 * Parameters: none
 * 
 * Method: GET
 * */    
$app->get('/getUserByEmail[/{email}]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->getUserByEmail($args['email']);
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getUserByLead/<lead_id>
 * Parameters: none
 * 
 * Method: POST
 * */    
$app->post('/getUserByLead[/{lead_id}]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    if($db->isValidUser($args['lead_id'])){
        $result = $db->getUserByLead($args['lead_id']);
        if($result != 0){
            $response_data = makeResponse('false',$result);
        }else{
            $response_data = makeResponse('true',get_site_error(3002));
        }
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }
    $response->withJson($response_data);
    return $response;
    
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getOtherTeamMembers/<user_id>
 * Parameters: none
 * 
 * Method: GET
 * */    
$app->post('/getOtherTeamMembers[/{user_id}]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    if($db->isValidUser($args['user_id'])){
        $result = $db->getOtherTeamMembers($args['user_id']);
        if(count($result) > 0){
            $response_data = makeResponse('false',$result);
        }else{
            $response_data = makeResponse('true',get_site_error(3002));
        }
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }
    $response->withJson($response_data);
    return $response;
    
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getRatingByUser/<user_id>
 * Parameters: none
 * 
 * Method: GET
 * */    
$app->get('/getRatingByUser[/{user_id}]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    if($db->isValidUser($args['user_id'])){
        $result = $db->getRatingByUser($args['user_id']);
        if($result != ""){
            $response_data = makeResponse('false',$result);
        }else{
            $response_data = makeResponse('true',get_site_error(3002));
        }
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }
    $response->withJson($response_data);
    return $response;
    
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/addRating
 * Parameters: 
 * from_id User id who is giving rating
 * to_id User id to whom rating is given
 * rating rating either +1 or -1
 * desc comment
 * Method: POST
 * */    
$app->post('/addRating', function ($request, $response) {
    $response_data = [];
    $data = $request->getParsedBody();
    $post_data = [];
    $post_data['from_id'] = filter_var($data['from_id'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['to_id']   = filter_var($data['to_id'], FILTER_SANITIZE_NUMBER_INT);     
    $post_data['rating'] = filter_var($data['rating'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['desc'] = filter_var($data['desc'], FILTER_SANITIZE_STRING);
    
    if($post_data['from_id'] > 0 && $post_data['to_id'] > 0 && ($post_data['rating'] == 0 || $post_data['rating'] == 1)){
        //Creating a dbmodule object
        $db = new dbmodule();
        // Check Is valid user
        if($db->isValidUser( $post_data['from_id'] )){
            // Check user is belong to your team
            if($db->isInMyTeam($post_data['from_id'], $post_data['to_id'])){
                $result = $db->addRating($post_data);
                if($result != ""){
                    $response_data = makeResponse('false',$result);
                }else{
                    $response_data = makeResponse('true',get_site_error(3004));
                }
            }else{
                $response_data = makeResponse('true',get_site_error(3006));
            }
        }else{
            $response_data = makeResponse('true',get_site_error(3002));
        }
    }else{
       $response_data = makeResponse('true',get_site_error(3004)); 
    }    
    $response->withJson($response_data);
    return $response;
    
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/updateProfile
 * Parameters: 
 * user_id User id
 * mob user's mobile number
 * des user's designation
 * 
 * Method: POST
 * */    
$app->post('/updateProfile', function ($request, $response) {
    $db = new dbmodule();
    $response_data = [];
    $data = $request->getParsedBody();
    $post_data = [];
    $post_data['user_id'] = filter_var($data['user_id'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['mob']   = filter_var($data['mob'], FILTER_SANITIZE_STRING);     
    $post_data['des'] = filter_var($data['desc'], FILTER_SANITIZE_STRING);
    $post_data['skills'] = filter_var($data['skills'], FILTER_SANITIZE_STRING);
    $post_data['associate_with_infobeans'] = filter_var($data['date'], FILTER_SANITIZE_STRING);
    $post_data['projects'] = filter_var($data['projects'], FILTER_SANITIZE_STRING); 
    $post_data['primary_project'] = filter_var($data['primary_project'], FILTER_SANITIZE_STRING); 
    $post_data['interests'] = filter_var($data['interests'], FILTER_SANITIZE_STRING);
    $post_data['location'] = filter_var($data['location'], FILTER_SANITIZE_STRING); 
    if(is_array($data['location'])){
        $post_data['location'] = implode(",",$data['location']);
    }
    if(is_array($data['desc'])){
        $post_data['des'] = implode(",",$data['desc']);
    }
    if(is_array($data['projects'])){
        $post_data['projects'] = implode(",",$data['projects']);
    }
    if(is_array($data['primary_project'])){
        $post_data['primary_project'] = implode(",",$data['primary_project']);
    }
    if(is_array($data['interests'])){
        $post_data['interests'] = implode(",",$data['interests']);
    }
	$post_data['mob'] = str_replace("+91-", "", $post_data['mob']);
    if($post_data['mob']=="NO NUMBER")
    {
        $post_data['mob'] = '';   
    }
    if($db->isValidUser( $post_data['user_id'] )){
        if (!preg_replace( '/^[1-9][0-9]*$/', '', $post_data['mob'] )) {
            //Creating a dbmodule object
            $result = $db->updateProfile($post_data);

            if($result != ""){
                $response_data = makeResponse('false',$result);
            }else{
                $response_data = makeResponse('true',get_site_error(3005));
            }
        }else{
           $response_data = makeResponse('true',get_site_error(3013)); 
        }
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }    
    $response->withJson($response_data);
    return $response;
    
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/createProfile
 * Parameters: 
 * r_d User role default will be 9
 * g_d user's google id
 * g_n user's google name
 * g_e user's google email
 * g_p_l user's google picture link
 * 
 * 
 * Method: POST
 * */    
$app->post('/createProfile', function ($request, $response) {
    $response_data = [];
    $data = $request->getParsedBody();
    $post_data = [];
    $post_data['r_d'] = filter_var($data['r_d'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['g_d']   = filter_var($data['g_d'], FILTER_SANITIZE_NUMBER_INT);     
    $post_data['g_n'] = filter_var($data['g_n'], FILTER_SANITIZE_STRING);
    $post_data['g_e'] = filter_var($data['g_e'], FILTER_SANITIZE_EMAIL);
    $post_data['g_p_l'] = filter_var($data['g_p_l'], FILTER_SANITIZE_STRING);
    
    
    if($post_data['r_d'] && $post_data['g_d'] && $post_data['g_n'] && $post_data['g_e']){
        //Creating a dbmodule object
        $db = new dbmodule();
        $result = $db->createProfile($post_data);

        if($result != ""){
            $response_data = makeResponse('false',$result);
        }else{
            $response_data = makeResponse('true',get_site_error(3007));
        }
    }else{
       $response_data = makeResponse('true',get_site_error(3007)); 
    }

    $response->withJson($response_data);
    return $response;
    
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/rateOtherMember
 * Parameters: 
 * user_id User id who is giving rating
 * for_id User id to whom rating is given
 * rating rating either +1
 * desc comment
 * Method: POST
 * */    
$app->post('/rateOtherMember', function ($request, $response) {
    $response_data = [];
    $data = $request->getParsedBody();
    $post_data = [];
    $post_data['user_id'] = filter_var($data['user_id'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['for_id']   = filter_var($data['for_id'], FILTER_SANITIZE_NUMBER_INT);     
    $post_data['rating'] = filter_var($data['rating'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['desc'] = filter_var($data['desc'], FILTER_SANITIZE_STRING);
    
    if($post_data['user_id'] > 0 && $post_data['for_id'] > 0 && $post_data['rating'] == 1 ){
        //Creating a dbmodule object
        $db = new dbmodule();
        if($db->isValidUser( $post_data['user_id'] )){
            $result = $db->rateOtherMember($post_data);
            if($result != ""){
                $response_data = makeResponse('false',$data);
            }else{
                $response_data = makeResponse('true',get_site_error(3004));
            }
        }else{
        $response_data = makeResponse('true',get_site_error(3002));
    } 
    }else{
       $response_data = makeResponse('true',get_site_error(3004)); 
    }    
    $response->withJson($response_data);
    return $response;
    
});


$app->get('/', function ($request, $response, $args) {
    $response->write("Welcome to Parakh!");
    return $response;
});

$app->get('/hello[/{name}]', function ($request, $response, $args) {
    $response->write("Hello, " . $args['name']);
    return $response;
})->setArgument('name', 'World!');


/* *
 * URL: http://localhost/parakh-new/v1/index.php/getRankingList/
 * Parameters: none
 * 
 * Method: GET
 * */    
$app->get('/getRankingList[/]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_ranking_list();
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getRecentRatingingList/
 * Parameters: none
 * 
 * Method: GET
 * */    
$app->get('/getRecentRatingingList[/]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_recent_ratings();
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getMyRank/<loginUserId>
 * Parameters: none
 * 
 * Method: GET
 * */    
$app->get('/getMyRank[/{loginUserId}]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_my_rank_position($args['loginUserId']);
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }    
    $response->withJson($response_data);
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getFeedbackById/<userId>
 * Parameters: none
 * 
 * Method: GET
 * */    
$app->get('/getFeedbackById[/{userId}]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_feedback_by_id($args['userId']);
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }    
    $response->withJson($response_data);
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/addFeedback
 * Parameters: 
 * feedback_from User id who is giving rating
 * feedback_to User id to whom rating is given
 * feedback_description comment
 * Method: POST
 * */    
$app->post('/addFeedback', function ($request, $response) {
    $response_data = [];
    $data = $request->getParsedBody();
    $post_data = [];
    $post_data['feedback_from'] = filter_var($data['feedback_from'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['feedback_to']   = filter_var($data['feedback_to'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['feedback_description'] = filter_var($data['feedback_description'], FILTER_SANITIZE_STRING);
    if($post_data['feedback_from'] > 0 && $post_data['feedback_to'] > 0){
        //Creating a dbmodule object
        $db = new dbmodule();
        // Check Is valid user
        if($db->isValidUser( $post_data['feedback_from'] )){
            $result = $db->addFeedback($post_data);
            if($result != ""){
                $response_data = makeResponse('false',$result);
            }else{
                $response_data = makeResponse('true',get_site_error(3008));
            }
        }else{
            $response_data = makeResponse('true',get_site_error(3002));
        }
    }else{
       $response_data = makeResponse('true',get_site_error(3008)); 
    }    
    $response->withJson($response_data);
    return $response;
    
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getAllTeamMembers/<userId>
 * Parameters: none
 * 
 * Method: Post
 * */    
$app->post('/getAllTeamMembers[/{userId}]', function ($request, $response, $args) {
    $response_data = array();
    //Creating a dbmodule object
    
    $db = new dbmodule();
    $result = $db->get_all_team_members($args['userId']);
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }    
    $response->withJson($response_data);
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/addFeedbackResponce
 * Parameters: 
 * login_user_id User id who is giving rating
 * feedback_to User id to whom rating is given
 * feedback_desc comment
 * Feedback_id feedbcak id
 * Method: POST
 * */    
$app->post('/addFeedbackResponce', function ($request, $response) {
    $response_data = [];
    $data = $request->getParsedBody();
    $post_data = [];
    $post_data['login_user_id'] = filter_var($data['login_user_id'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['feedback_to'] = filter_var($data['feedback_to'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['feedback_desc'] = filter_var($data['feedback_desc'], FILTER_SANITIZE_STRING);
    $post_data['feedback_id'] = filter_var($data['feedback_id'], FILTER_SANITIZE_NUMBER_INT);
    if($post_data['login_user_id'] > 0 && $post_data['feedback_to'] > 0){
        //Creating a dbmodule object
        $db = new dbmodule();
        // Check Is valid user
        if($db->isValidUser( $post_data['login_user_id'] )){
            $result = $db->feedbackResponseSave($post_data);
            if($result != ""){
                $response_data = makeResponse('false',$result);
            }else{
                $response_data = makeResponse('true',get_site_error(3008));
            }
        }else{
            $response_data = makeResponse('true',get_site_error(3002));
        }
    }else{
       $response_data = makeResponse('true',get_site_error(3008)); 
    }    
    $response->withJson($response_data);
    return $response;
    
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getAllLeads/<userId>
 * Parameters: user id
 * 
 * Method: GET
 * */    
$app->get('/getAllLeads[/{userId}]', function ($request, $response, $args) {
    $response_data = array();
    //Creating a dbmodule object
    $db = new dbmodule();
    
    if($db->isValidUser( $args['userId'] )){
        $result = $db->getAllLeads($args['userId']);
        if($result != 0){
            $response_data = makeResponse('false',$result);
        }else{
            $response_data = makeResponse('true',get_site_error(3009));
        }    
        $response->withJson($response_data);
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }    
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/requestForOne
 * Parameters: 
 * u_id User id who is giving rating
 * l_id Manager or Lead id to whom user is requesting
 * desc comment
 * Method: POST
 * Content-Type: application/x-www-form-urlencoded
 * */    
$app->post('/requestForOne', function ($request, $response) {
    $response_data = [];
    $data = $request->getParsedBody();
    $post_data = [];
    $post_data['u_id'] = filter_var($data['u_id'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['l_id']   = filter_var($data['l_id'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['desc'] = filter_var($data['desc'], FILTER_SANITIZE_STRING);
    
    if($post_data['u_id'] > 0 && $post_data['l_id'] > 0){
        //Creating a dbmodule object
        $db = new dbmodule();
        // Check Is valid user
        if($db->isValidUser( $post_data['u_id'] )){
            $result = $db->requestForOne($post_data);
            if($result != ""){
                $response_data = makeResponse('false',$result);
            }else{
                $response_data = makeResponse('true',get_site_error(3010));
            }
        }else{
            $response_data = makeResponse('true',get_site_error(3002));
        }
    }else{
       $response_data = makeResponse('true',get_site_error(3010)); 
    }    
    $response->withJson($response_data);
    return $response;
    
});


/* *
 * URL: http://localhost/parakh-new/v1/index.php/getTeamMembersRequest/<userId>
 * Parameters: user id
 * 
 * Method: GET
 * */    
$app->get('/getTeamMembersRequest[/{userId}]', function ($request, $response, $args) {
    $response_data = array();
    //Creating a dbmodule object
    $db = new dbmodule();
    
    if($db->isValidUser( $args['userId'] )){
        $result = $db->getTeamMembersRequest($args['userId']);
        if($result != 0){
            $response_data = makeResponse('false',$result);
        }else{
            $response_data = makeResponse('true',get_site_error(3009));
        }    
        $response->withJson($response_data);
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }    
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getPendingRequest/<userId>
 * Parameters: user id
 * 
 * Method: GET
 * */    
$app->get('/getPendingRequest[/{userId}]', function ($request, $response, $args) {
    $response_data = array();
    //Creating a dbmodule object
    $db = new dbmodule();
    
    if($db->isValidUser( $args['userId'] )){
        $result = $db->getPendingRequest($args['userId']);
        if($result != 0){
            $response_data = makeResponse('false',$result);
        }else{
            $response_data = makeResponse('true',get_site_error(3009));
        }    
        $response->withJson($response_data);
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }    
    return $response;
});


/* *
 * URL: http://localhost/parakh-new/v1/index.php/requestDecision
 * Parameters: 
 * u_id: user id
 * rq_id: request id
 * st: status
 * desc: comment
 * to_id: user for whom taking that decision
 * Method: POST
 * Content-Type: application/x-www-form-urlencoded
 * */    
$app->post('/requestDecision', function ($request, $response) {
    $response_data = [];
    $data = $request->getParsedBody();
    $post_data = [];
    $post_data['to_id'] = filter_var($data['to_id'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['u_id'] = filter_var($data['u_id'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['rq_id'] = filter_var($data['rq_id'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['st']   = filter_var($data['st'], FILTER_SANITIZE_NUMBER_INT);
    $post_data['desc'] = filter_var($data['desc'], FILTER_SANITIZE_STRING);
    
    if($post_data['u_id'] > 0 && $post_data['rq_id'] > 0){
        //Creating a dbmodule object
        $db = new dbmodule();
        // Check Is valid user
        if($db->isValidUser( $post_data['u_id'] )){
            $result = $db->requestDecision($post_data);
            if($result != ""){
                $response_data = makeResponse('false',$result);
            }else{
                $response_data = makeResponse('true',get_site_error(3012));
            }
        }else{
            $response_data = makeResponse('true',get_site_error(3002));
        }
    }else{
       $response_data = makeResponse('true',get_site_error(3012)); 
    }    
    $response->withJson($response_data);
    return $response;
    
});


/* *
 * URL: http://localhost/parakh-new/v1/index.php/getRecentActivity/<userId>
 * Parameters: user id
 * 
 * Method: GET
 * */    
$app->get('/getRecentActivity[/{userId}]', function ($request, $response, $args) {
    $response_data = array();
    //Creating a dbmodule object
    $db = new dbmodule();
    
    if($db->isValidUser( $args['userId'] )){
        $result = $db->getRecentActivity($args['userId']);
        if($result != 0){
            $response_data = makeResponse('false',$result);
        }else{
            $response_data = makeResponse('true',get_site_error(3009));
        }    
        $response->withJson($response_data);
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }    
    return $response;
});

$app->get('/testemail', function ($request, $response, $args) {
    $db = new dbmodule();
    $db->testemail();
    return "testing....";
});


/* *
 * URL: http://localhost/parakh-new/v1/index.php/getUserPendingRequest/<userId>/<status>
 * Parameters: user id, status
 * 
 * Method: GET
 * */    
$app->get('/getUserPendingRequest[/{userId}/{status}]', function ($request, $response, $args) {
    $response_data = array();
    //Creating a dbmodule object
    $db = new dbmodule();

    if($db->isValidUser( $args['userId'] )){
        $result = $db->getUserPendingRequest($args['userId'],$args['status']);
        if($result != 0){
            $response_data = makeResponse('false',$result);
        }else{
            $response_data = makeResponse('true',get_site_error(3009));
        }    
        $response->withJson($response_data);
    }else{
        $response_data = makeResponse('true',get_site_error(3002));
    }    
    return $response;
});


/* *
 * URL: http://localhost/parakh-new/v1/index.php/getCountForUnreadNotification/
 * Parameters: UserId
 * 
 * Method: GET
 * */    
$app->get('/getCountForUnreadNotification[/{userId}]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_count_for_unread_notification($args['userId']);
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/resetNotifCount
 * Parameters: 
 * u_id: user id
 * 
 * Method: POST
 * Content-Type: application/x-www-form-urlencoded
 * */    
$app->post('/resetNotifCount', function ($request, $response) {
    $response_data = [];
    $data = $request->getParsedBody();
    $post_data = [];
    $post_data['userId'] = filter_var($data['userId'], FILTER_SANITIZE_NUMBER_INT);
    
    
    if($post_data['userId'] > 0 ){
        //Creating a dbmodule object
        $db = new dbmodule();
        // Check Is valid user
        if($db->isValidUser( $post_data['userId'] )){
            $result = $db->resetNotifCount($post_data);
            if($result != ""){
                $response_data = makeResponse('false',$result);
            }else{
                $response_data = makeResponse('true',get_site_error(3012));
            }
        }else{
            $response_data = makeResponse('true',get_site_error(3002));
        }
    }else{
       $response_data = makeResponse('true',get_site_error(3012)); 
    }    
    $response->withJson($response_data);
    return $response;
    
});


/* *
 * URL: http://localhost/parakh-new/v1/index.php/getTopFourRankForCurrentMonth/
 * Parameters: 
 * 
 * Method: GET
 * */    
$app->get('/getTopFourRankForCurrentMonth[/]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_top_four_ranker_for_current_month();
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getTopRankersProjectWise/<managerId>
 * Parameters: managerId
 * 
 * Method: GET
 * */    
$app->get('/getTopRankersProjectWise[/{managerId}]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_top_rankers_project_wise($args['managerId']);
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});

/* *
 * URL: http://localhost/parakh-new/v1/index.php/getTopRankersCalendarWise/<leadId>
 * Parameters: leadId
 * 
 * Method: GET
 * */    
$app->get('/getTopRankersCalendarWise[/{leadId}]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_top_rankers_calendar_wise($args['leadId']);
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});


/* *
 * URL: http://localhost/parakh-new/v1/index.php/getAllProjects/
 * Parameters: 
 * 
 * Method: GET
 * */    
$app->get('/getAllProjects[/]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_all_projects();
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});


/* *
 * URL: http://localhost/parakh-new/v1/index.php/getAllInterests/
 * Parameters: 
 * 
 * Method: GET
 * */    
$app->post('/getAllInterests[/]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_all_interests();
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});


/* *
 * URL: http://localhost/parakh-new/v1/index.php/getAllDesignations/
 * Parameters: 
 * 
 * Method: GET
 * */    
$app->post('/getAllDesignations[/]', function ($request, $response, $args) {
    $response_data = array();
    
    //Creating a dbmodule object
    $db = new dbmodule();
    $result = $db->get_all_designations();
    if($result != 0){
        $response_data = makeResponse('false',$result);
    }else{
        $response_data = makeResponse('true',get_site_error(3001));
    }    
    $response->withJson($response_data);
    return $response;
});
/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();
