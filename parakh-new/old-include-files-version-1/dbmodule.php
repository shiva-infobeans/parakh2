<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class dbmodule
{
    //Database connection link
    private $con;
    private $my_team_id;
 
    //Class constructor
    function __construct()
    {
        //Getting the DbConnect.php file
        require_once dirname(__FILE__) . '/dbconnect.php';
 
        //Creating a DbConnect object to connect to the database
        $db = new dbconnect();
 
        //Initializing our connection link of this class
        //by calling the method connect of DbConnect class
        $this->con = $db->connect();
    }
    
    
    /* *
     * get user details by email
     * */    
    function getUserByEmail($email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $query = "select u.*,rt.name as role_name from users as u, role_type as rt where google_email = :email AND u.role_id = rt.id";

            
            $profile_data = $this->con->prepare($query); 
            $profile_data->execute(array(':email'=>$email));
            $row = $profile_data->fetch((PDO::FETCH_ASSOC));
                        
            if(isset($row) && !empty($row)){
                return $row;
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    } //end of fun
     
    /* *
     * get all the users by lead id
     * */    
    function getUserByLead($lead_id)
    {
        if (!filter_var($lead_id, FILTER_VALIDATE_INT) === false) {
            $employeeList = array();
            $query = 'SELECT uh.user_id,u.google_name,u.designation,u.google_picture_link,u.google_email FROM user_hierarchy uh left join users u on u.id = uh.user_id ' .
                    'WHERE manager_id = :id  AND u.status <> 0 group by user_id';
            $user_data = $this->con->prepare($query);
            $user_data->execute(array(':id' => $lead_id));
            while ($row = $user_data->fetch((PDO::FETCH_ASSOC))) {
                $membresInfo = array();
                $membresInfo = array('user_id' => $row['user_id'], 'user_name' => $row['google_name'],'designation' => $row['designation'],'picture' => $row['google_picture_link'],'email' => $row['google_email']);
                $employeeList[] = $membresInfo;
                $this->getUserByLead($row['user_id']);
            }
            return $employeeList;
        }else{
            return 0;
        }
    }//end of fun
    
    function joinArray($item,$key)
    {
        if(trim($this->my_team_id) == ""){
            $this->my_team_id = $item['user_id'];
        }else{
            $this->my_team_id = $this->my_team_id.", ".$item['user_id'];
        }    
    }
    
    /* *
     * get all the users other then user present under lead
     * */    
    function getOtherTeamMembers($lead_id)
    {
        if (!filter_var($lead_id, FILTER_VALIDATE_INT) === false) {
            $employeeList = array();
            $team_members = $this->getUserByLead($lead_id);
            if(count($team_members) > 0){
                $this->my_team_id = "";
                array_walk($team_members,array($this, 'joinArray'));
            }
            
            $condition = '';
            if (!empty($this->my_team_id)) {
                $condition = "id NOT IN ($this->my_team_id)  AND";
            }
            $query = "SELECT `id`,`google_name`,`designation`,`google_picture_link` FROM users WHERE $condition id <>:id AND id <> 1 AND status <> 0 ORDER BY google_name";
            $user_list = $this->con->prepare($query);
            $user_list->execute(array(':id' => $lead_id));
            $employeeList = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $employeeList;
        }else{
            return 0;
        }        
    }//end of fun
    
    function isInMyTeam($user_id,$member_id)
    {   
        $query = 'SELECT uh.user_id FROM user_hierarchy uh left join users u on u.id = uh.user_id ' .
                'WHERE manager_id = :id AND uh.user_id = :mem_id AND u.status <> 0 group by user_id';
        $user_data = $this->con->prepare($query);
        $user_data->execute(array(':id' => $user_id,':mem_id' => $member_id));
        $row = $user_data->fetch((PDO::FETCH_ASSOC));
        if(isset($row['user_id'])){
            return true;
        }else{
            return false;
        }
    }//end of fun


    /* *
     * get user's rating by user id
     * */
    function getRatingByUser($user_id)
    {
        
        if (!filter_var($user_id, FILTER_VALIDATE_INT) === false) {
            $query = "SELECT work.work_date,work.title,if( comment.comment_text != '', comment.comment_text, work.description ) AS description,work.created_by as given_by,user.google_name as given_by_name,rating.user_id,rating.rating as rating,rating.id as rate_id,rating.created_date, comment.comment_text AS manager_comment FROM rating AS rating  LEFT JOIN work AS work  ON rating.work_id = work.id
                        LEFT JOIN users AS user ON user.id = rating.given_by
                        LEFT JOIN comment AS comment ON comment.request_id = rating.request_id
                        WHERE rating.user_id= :user_id  ORDER BY rating.created_date desc ";
            $user_list = $this->con->prepare($query);
            //return $query;
            $user_list->execute(array(':user_id' => $user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }else{
            return 0;
        }   
    }//end of fun
    
    /* *
     * Add rating in database
     * */
    function addRating($data)
    {
        $data['work_title'] = "System generated";
        $data['desc'] = $data['desc'];
        
        $dateTime = new \DateTime();
        $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
        $login_user_id = $data['from_id'];
        $workdate = '';
        if ($data['work_date'] != '' || !empty($data['work_date']))
            $workdate = date('Y-m-d H:i:s', strtotime($data['work_date']));
        $show = 1;
        $approved = 2;
        $work_insert_query = "INSERT INTO work(user_id, title, description, created_by, request_for, created_date, modified_date, work_date)
                              VALUES(:user_id,:work_title,:description,:created_by,:request_for,:created_date,:modified_date,:work_date)";
        $work_insert = $this->con->prepare($work_insert_query);
        $work_insert->execute(array(':user_id' => $data['from_id'],
            ':work_title' => $data['work_title'],
            ':description' => $data['desc'],
            ':created_by' => $login_user_id,
            ':request_for' => $data['rating'],
            ':created_date' => $created_date,
            ':modified_date' => $modified_date,
            ':work_date' => $workdate));
        $work_last_insert = $this->con->lastInsertId();
        
        $request_insert_query = "INSERT INTO request(from_id, to_id, status, work_id, created_date, modified_date, show_request)
                                 VALUES(:from_id,:to_id,:status,:work_id,:created_date,:modified_date,:show_request)";
        $request_insert = $this->con->prepare($request_insert_query);
        $request_insert->execute(array(':from_id' => $login_user_id,
            ':to_id' => $data['to_id'],
            ':status' => $approved,
            ':work_id' => $work_last_insert,
            ':created_date' => $created_date,
            ':modified_date' => $modified_date,
            ':show_request' => $show));
        $request_last_insert = $this->con->lastInsertId();
        
        $rating_insert_query = "INSERT INTO rating(request_id, work_id, user_id, rating, given_by, created_date, modified_date, show_rating)
                                VALUES(:request_id,:work_id,:user_id,:rating,:given_by,:created_date,:modified_date,:show_rating)";
        $rating_insert = $this->con->prepare($rating_insert_query);
        $rating_insert->execute(array(':request_id' => $request_last_insert,
            ':work_id' => $work_last_insert,
            ':user_id' => $data['to_id'],
            ':rating' => $data['rating'],
            ':given_by' => $login_user_id,
            ':created_date' => $created_date,
            ':modified_date' => $modified_date,
            ':show_rating' => $show));
        
        if (isset($data['comment']) && !empty($data['comment'])) {
            $comment_insert_query = "INSERT INTO comment(request_id, comment_text, by_id, created_date, modified_date)
                                    VALUES(:request_id,:comment_text,:by_id,:created_date,:modified_date)";
            $comment_insert = $this->con->prepare($comment_insert_query);
            $comment_insert->execute(array(':request_id' => $request_last_insert,
                ':comment_text' => $data['comment'],
                ':by_id' => $login_user_id,
                ':created_date' => $created_date,
                ':modified_date' => $modified_date));
        }
        return true;
    }//end of fun
    
    /**
     * Update profile
     * @param type $data
     * @return type
     */
    function rateOtherMember($data)
    {
        $dateTime = new \DateTime();
        $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
        $login_user_id = $data['user_id'];
        $data['comment'] = $data['desc'];
        $data['user_id'] = $data['for_id'];
        $data['work_title'] = null;
        $work_insert_query = "INSERT INTO work(user_id,title, description, created_by, for_id, request_for, created_date, modified_date, work_date)
                              VALUES(:user_id,:work_title,:description,:created_by,:for_id,:request_for,:created_date,:modified_date,:work_date)";
        $work_insert = $this->con->prepare($work_insert_query);
        $work_insert->execute(array(':user_id' => $data['user_id'],
            ':work_title' => $data['work_title'],
            ':description' => $data['desc'],
            ':created_by' => $login_user_id,
            ':request_for' => '1',
            ':for_id' => $data['for_id'],
            ':created_date' => $created_date,
            ':modified_date' => $modified_date,
            ':work_date' => ''));
        $work_last_insert = $this->con->lastInsertId();
        $request_insert_query = "INSERT INTO request(from_id, to_id, status, work_id, created_date, modified_date, show_request)
                                 VALUES(:from_id,:to_id,:status,:work_id,:created_date,:modified_date,:show_request)";
        $request_insert = $this->con->prepare($request_insert_query);
        $request_insert->execute(array(':from_id' => $login_user_id,
            ':to_id' => $data['user_id'],
            ':status' => '2',
            ':work_id' => $work_last_insert,
            ':created_date' => $created_date,
            ':modified_date' => $modified_date,
            ':show_request' => '1'));
        $request_last_insert = $this->con->lastInsertId();
        $rating_insert_query = "INSERT INTO rating(request_id, work_id, user_id, rating, given_by, created_date, modified_date, show_rating)
                                VALUES(:request_id,:work_id,:user_id,:rating,:given_by,:created_date,:modified_date,:show_rating)";
        $rating_insert = $this->con->prepare($rating_insert_query);
        $rating_insert->execute(array(
            'request_id' => $request_last_insert,
            ':work_id' => $work_last_insert,
            ':user_id' => $data['for_id'],
            ':rating' => '1',
            ':given_by' => $login_user_id,
            ':created_date' => $created_date,
            ':modified_date' => $modified_date,
            ':show_rating' => '2'));
        return true;
    }//end for fun
    
    /**
     * Update profile
     * @param type $data
     * @return type
     */
    function updateProfile($data)
    {
        $query = "UPDATE users SET designation = :des,mobile_number = :mob WHERE id = :id";
        $update_profile_data = $this->con->prepare($query);
        $query_result = $update_profile_data->execute(array(':des' => $data['des'],':mob' => $data['mob'],':id' => $data['user_id']));
        return $query_result;       
    }//end of fun
    

     /**
     * Update profile
     * @param type $data
     * @return type
     */
    function createProfile($data)
    {
        $data['c_d'] = date('Y-m-d H:i:s');
        $query = "INSERT INTO users (role_id,google_id, google_name, google_email, google_picture_link,created_date)
                 VALUES(:r_d,:g_d,:g_n,:g_e,:g_p_l,:c_d)";
        $profile_data = $this->con->prepare($query);
        $query_result = $profile_data->execute(array(':r_d' => $data['r_d'],':g_d' => $data['g_d'],':g_n' => $data['g_n'],':g_n' => $data['g_e'],':g_p_l' => $data['g_p_l'],':c_d' => $data['c_d']));
        return $query_result;         
    }//end of fun
    
     /**
     * Check user is valid or not
     * @param type $id
     * @return bool
     */
    function isValidUser($id)
    {
        if(!filter_var($id, FILTER_VALIDATE_INT) === false){
            $query = "SELECT id FROM users WHERE id = :id";
            $profile_data = $this->con->prepare($query);
            $query_result = $profile_data->execute(array(':id' => $id));
            $row = $profile_data->fetch((PDO::FETCH_ASSOC));
            
            if($row['id'] > 0){
               return true; 
            }else{
               return false;
            }
        }else{
            return false;
        }
    }//end of fun
    
} //end of class