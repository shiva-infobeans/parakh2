<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class dbmodule {

    //Database connection link
    private $con;
    private $my_team_id;
    public $site_name = '';
    public $site_url = '';
    public $manager_email = '';
    public $manager_name = '';
    public $from_email = '';
    public $from_name = '';

    //Class constructor
    function __construct() {
        //Getting the DbConnect.php file
        require_once dirname(__FILE__) . '/dbconnect.php';
        require_once dirname(__FILE__) . '/config.php';

        //Creating a DbConnect object to connect to the database
        $db = new dbconnect();

        //Initializing our connection link of this class
        //by calling the method connect of DbConnect class
        $this->con = $db->connect();
        $this->site_name = SITE_NAME;
        $this->site_url = SITE_URL;
        $this->manager_email = MANAGER_EMAIL;
        $this->manager_name = MANAGER_NAME;
        $this->from_email = FROM_EMAIL;
        $this->from_name = FROM_NAME;
    }

    /*     *
     * get user details by email
     * */

    function getUserByEmail($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $query = "select u.*,rt.name as role_name from users as u, role_type as rt where google_email = :email AND u.role_id = rt.id";

            $profile_data = $this->con->prepare($query);
            $profile_data->execute(array(':email' => $email));
            $row = $profile_data->fetch((PDO::FETCH_ASSOC));

            if (isset($row) && !empty($row)) {
                return $row;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

//end of fun

    /*     *
     * get all the users by lead id
     * */

    function getUserByLead($lead_id) {
        if (!filter_var($lead_id, FILTER_VALIDATE_INT) === false) {
            $employeeList = array();
            $query = 'SELECT uh.user_id,u.google_name,u.google_email,u.mobile_number,u.designation,u.google_picture_link,u.google_email FROM user_hierarchy uh left join users u on u.id = uh.user_id ' .
                    'WHERE manager_id = :id  AND u.status <> 0 group by user_id';
            $user_data = $this->con->prepare($query);
            $user_data->execute(array(':id' => $lead_id));
            while ($row = $user_data->fetch((PDO::FETCH_ASSOC))) {
                $membresInfo = array();
                $query_rank = "SELECT MAX(r.created_date) as date,
                    sum(case when r.rating = 1 then 1  end) as pluscount,
                    sum(case when r.rating = 0 then 1  end) as minuscount
                    from rating as r join users as u ON (u.id =r.user_id) WHERE u.status <> 0 
                    and u.id=:id group by r.user_id ORDER BY pluscount DESC, minuscount ASC,date ASC LIMIT 10";
                $user_rank = $this->con->prepare($query_rank);
                $user_rank->execute(array(':id' => $row['user_id']));
                $userRank = $user_rank->fetchAll((PDO::FETCH_ASSOC));
                if(isset($userRank[0]['pluscount']) && !empty($userRank[0]['pluscount']))
                {
                    $userRank[0]['pluscount'] = "+".$userRank[0]['pluscount'];
                }else
                {
                    $userRank[0]['pluscount'] = 0;
                }
                if(isset($userRank[0]['minuscount']) && !empty($userRank[0]['minuscount']))
                {
                    $userRank[0]['minuscount'] = "-".$userRank[0]['minuscount'];
                }else
                {
                    $userRank[0]['minuscount'] = 0;
                }
                $membresInfo = array('user_id' => $row['user_id'], 'user_name' => $row['google_name'],'designation' => $row['designation'],'picture' => $row['google_picture_link'],'email' => $row['google_email'],'mobile_number' => $row['mobile_number'],'pluscount' => $userRank[0]['pluscount'],'minuscount' => $userRank[0]['minuscount']);
                $employeeList[] = $membresInfo;
                $this->getUserByLead($row['user_id']);
            }
            return $employeeList;
        } else {
            return 0;
        }
    }

//end of fun

    function joinArray($item, $key) {
        if (trim($this->my_team_id) == "") {
            $this->my_team_id = $item['user_id'];
        } else {
            $this->my_team_id = $this->my_team_id . ", " . $item['user_id'];
        }
    }

    /*     *
     * get all the users other then user present under lead
     * */

    function getOtherTeamMembers($lead_id) {
       if (!filter_var($lead_id, FILTER_VALIDATE_INT) === false) {
           $employeeList = array();
           $team_members = $this->getUserByLead($lead_id);
           if (count($team_members) > 0) {
               $this->my_team_id = "";
               array_walk($team_members, array($this, 'joinArray'));
           }

           $condition = '';
           if (!empty($this->my_team_id)) {
               $condition = "id NOT IN ($this->my_team_id)  AND";
           }
           $query = "SELECT `id`,`google_name`,`google_email`,`mobile_number`,`designation`,`google_picture_link` FROM users WHERE $condition id <>:id AND id <> 1 AND status <> 0 ORDER BY google_name";
           $user_list = $this->con->prepare($query);
           $user_list->execute(array(':id' => $lead_id));
           $employeeList = $user_list->fetchAll((PDO::FETCH_ASSOC));
           $id_array = array();
           foreach ($employeeList as $key => $value) {
               $id_array[] = $value['id'];
           }
           $id_array = implode(",",$id_array);

           $query_rank = "SELECT u.id,u.google_name,
                    sum(case when r.rating = 1 then 1  end) as pluscount,
                    sum(case when r.rating = 0 then 1  end) as minuscount
                    from rating as r join users as u ON (u.id =r.user_id) WHERE u.status <> 0 
                    group by r.user_id ORDER BY u.google_name";
                $user_rank = $this->con->prepare($query_rank);
                $user_rank->execute();
                $userRank = $user_rank->fetchAll((PDO::FETCH_ASSOC));
            foreach ($userRank as $key => $value) {
               $rank_array[$value['id']]['pluscount'] = $value['pluscount'];
               $rank_array[$value['id']]['minuscount'] = $value['minuscount'];
            }
            
            for($y=0;$y<count($employeeList);$y++)
            {
                if(isset($rank_array[$employeeList[$y]['id']]['pluscount']) && !empty($rank_array[$employeeList[$y]['id']]['pluscount']))
                {
                    $employeeList[$y]['pluscount'] = "+".$rank_array[$employeeList[$y]['id']]['pluscount'];
                }else
                {
                    $employeeList[$y]['pluscount'] = 0;
                }
                if(isset($rank_array[$employeeList[$y]['id']]['minuscount']) && !empty($rank_array[$employeeList[$y]['id']]['minuscount']))
                {
                    $employeeList[$y]['minuscount'] = "-".$rank_array[$employeeList[$y]['id']]['minuscount'];
                }else
                {
                    $employeeList[$y]['minuscount'] = 0;
                }
                
            }
           return $employeeList;
       } else {
           return 0;
       }
   }//end of fun
    
    function isInMyTeam($user_id,$member_id)
    {   
        $query = 'SELECT uh.user_id FROM user_hierarchy uh left join users u on u.id = uh.user_id ' .
                'WHERE manager_id = :id AND uh.user_id = :mem_id AND u.status <> 0 group by user_id';
        $user_data = $this->con->prepare($query);
        $user_data->execute(array(':id' => $user_id, ':mem_id' => $member_id));
        $row = $user_data->fetch((PDO::FETCH_ASSOC));
        if (isset($row['user_id'])) {
            return true;
        } else {
            return false;
        }
    }

//end of fun


    /*     *
     * get user's rating by user id
     * */

    function getRatingByUser($user_id) {

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
        } else {
            return 0;
        }
    }

//end of fun

    /*     *
     * Add rating in database
     * */

    function addRating($data) {
        $data['work_title'] = "System generated";
        $data['desc'] = $data['desc'];

        $dateTime = new \DateTime(null, new DateTimeZone('Asia/Kolkata'));
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
            ':work_date' => $created_date));
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
        $rating_last_insert = "";
        $rating_last_insert = $this->con->lastInsertId();

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
        // send email notifiction to user
        if ($rating_last_insert) {
            $email_data = [];
            $user_data = $this->getEmailById($data['to_id']);
            $temp_data = $this->getEmailTemplateByCode('PRKE01');
            $email_data['to']['email'] = $user_data['google_email'];
            $email_data['to']['name'] = $user_data['google_name'];
            $email_data['subject'] = $temp_data['subject'];
            $this->getParakhLink();
            $rating = ($data['rating'] == 0) ? '-1' : 1;
            $vars = array(
                "{username}" => $email_data['to']['name'],
                "{rating}" => $rating,
                "{parakh}" => $this->getParakhLink(),
            );
            $message = strtr($temp_data['content'], $vars);
            $email_data['message'] = $message;
            $this->send_notification($email_data);

            // send notification to manager
            //{member} has received a {rating} rating by {lead} for "{comment}".
            $email_data_l = [];
            $user_data_l = $this->getEmailById($data['from_id']);
            $temp_data_l = $this->getEmailTemplateByCode('PRKE21');
            $email_data_l['to']['email'] = $this->manager_email;
            //$email_data_l['to']['email'] = 'abhijeet.dange@infobeans.com';
            $email_data_l['to']['name'] = $this->manager_name;
            $email_data_l['subject'] = $temp_data_l['subject'];
            $rating = ($data['rating'] == 0) ? '-1' : 1;
            $vars = array(
                "{member}" => $email_data['to']['name'],
                "{rating}" => $rating,
                "{lead}" => $user_data_l['google_name'],
                "{comment}" => $data['desc'],
            );
            $message = strtr($temp_data_l['content'], $vars);
            $email_data_l['message'] = $message;
            $this->send_notification($email_data_l);

            /* update msg read count */
            $query = "SELECT msg_read from users where id=" . $data['to_id'];
            $user_list = $this->con->prepare($query);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {
                $query = "UPDATE users set msg_read=" . ($row[0]['msg_rea'] + 1) . " where id=" . $data['to_id'];
                $user_list = $this->con->prepare($query);
                $user_list->execute();
            }
        }
        return true;
    }

//end of fun

    function getParakhLink() {
        return '<a href="' . $this->site_url . '" >' . $this->site_name . '</a>';
    }

    function getEmailById($id) {
        if ($id) {
            $query = "SELECT google_email,google_name FROM users WHERE id = :id";
            $profile_data = $this->con->prepare($query);
            $query_result = $profile_data->execute(array(':id' => $id));
            $row = $profile_data->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function getEmailTemplateByCode($id) {
        if ($id != "") {
            $query = "SELECT * FROM email_templates WHERE code = :id";
            $profile_data = $this->con->prepare($query);
            $query_result = $profile_data->execute(array(':id' => $id));
            $row = $profile_data->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function testemail() {
        $email_data = $user_data = [];
        $user_data = $this->getEmailById(5);
        $temp_data = $this->getEmailTemplateByCode('PRKE01');
        $email_data['to']['email'] = $user_data['google_email'];
        $email_data['to']['name'] = $user_data['google_name'];
        $email_data['subject'] = $temp_data['subject'];
        $this->getParakhLink();
        $vars = array(
            "{username}" => $email_data['to']['name'],
            "{Parakh}" => $this->getParakhLink(),
        );

        $message = strtr($temp_data['content'], $vars);
        $email_data['message'] = $message;

        $this->send_notification($email_data);
    }

    /**
     * Send email notification
     */
    function send_notification($email_data) {
        require_once 'notifications.php';
        send_mail($email_data);
    }

//end of fun

    /**
     * Update profile
     * @param type $data
     * @return type
     */
    function rateOtherMember($data) {
        $dateTime = new \DateTime(null, new DateTimeZone('Asia/Kolkata'));
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
            ':work_date' => $modified_date));

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
        $rating_last_insert = "";
        $rating_last_insert = $this->con->lastInsertId();
        if ($rating_last_insert) {
            $email_data = [];
            $user_data = $this->getEmailById($data['for_id']);
            $temp_data = $this->getEmailTemplateByCode('PRKE01');
            $email_data['to']['email'] = $user_data['google_email'];
            $email_data['to']['name'] = $user_data['google_name'];
            $email_data['subject'] = $temp_data['subject'];
            $this->getParakhLink();
            $rating = 1;
            $vars = array(
                "{username}" => $email_data['to']['name'],
                "{rating}" => $rating,
                "{parakh}" => $this->getParakhLink(),
            );
            $message = strtr($temp_data['content'], $vars);
            $email_data['message'] = $message;
            $this->send_notification($email_data);

            // send notification to manager
            //{member} has received a {rating} rating by {lead} for "{comment}".
            $email_data_l = [];
            $user_data_l = $this->getEmailById($data['for_id']);
            $temp_data_l = $this->getEmailTemplateByCode('PRKE21');
            $email_data_l['to']['email'] = $this->manager_email;
            //$email_data_l['to']['email'] = 'abhijeet.dange@infobeans.com';
            $email_data_l['to']['name'] = $this->manager_name;
            $email_data_l['subject'] = $temp_data_l['subject'];
            $rating = ($data['rating'] == 0) ? '-1' : 1;
            $vars = array(
                "{member}" => $email_data['to']['name'],
                "{rating}" => $rating,
                "{lead}" => $user_data_l['google_name'],
                "{comment}" => $data['desc'],
            );
            $message = strtr($temp_data_l['content'], $vars);
            $email_data_l['message'] = $message;
            $this->send_notification($email_data_l);

            /* update msg read count */
            $query = "SELECT msg_read from users where id=" . $data['for_id'];
            $user_list = $this->con->prepare($query);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {
                $query = "UPDATE users set msg_read=" . ($row[0]['msg_read'] + 1) . " where id=" . $data['for_id'];
                $user_list = $this->con->prepare($query);
                $user_list->execute();
            }
        }
        return true;
    }

//end for fun

    /**
     * Update profile
     * @param type $data
     * @return type
     */
    function updateProfile($data) {
        $query = "UPDATE users SET designation = :des, skills = :skills, interests = :interests, projects = :projects, location = :location,associate_with_infobeans = :associate_with_infobeans, mobile_number = :mob,primary_project = :primary_project WHERE id = :id";
        $update_profile_data = $this->con->prepare($query);
        $query_result = $update_profile_data->execute(array(':des' => $data['des'], ':skills' => $data['skills'], ':projects' => $data['projects'], ':location' => $data['location'],':interests' => $data['interests'], ':associate_with_infobeans' => $data['associate_with_infobeans'], ':mob' => $data['mob'],':primary_project' => $data['primary_project'], ':id' => $data['user_id']));
        return $query_result;
    }

//end of fun

    /**
     * Update profile
     * @param type $data
     * @return type
     */
    function createProfile($data) {
        $data['c_d'] = date('Y-m-d H:i:s');
        $query = "INSERT INTO users (role_id,google_id, google_name, google_email, google_picture_link,created_date)
                 VALUES(:r_d,:g_d,:g_n,:g_e,:g_p_l,:c_d)";
        $profile_data = $this->con->prepare($query);
        $query_result = $profile_data->execute(array(':r_d' => $data['r_d'], ':g_d' => $data['g_d'], ':g_n' => $data['g_n'], ':g_n' => $data['g_e'], ':g_p_l' => $data['g_p_l'], ':c_d' => $data['c_d']));
        return $query_result;
    }

//end of fun

    /**
     * Check user is valid or not
     * @param type $id
     * @return bool
     */
    function isValidUser($id) {
        if (!filter_var($id, FILTER_VALIDATE_INT) === false) {
            $query = "SELECT id FROM users WHERE id = :id";
            $profile_data = $this->con->prepare($query);
            $query_result = $profile_data->execute(array(':id' => $id));
            $row = $profile_data->fetch((PDO::FETCH_ASSOC));

            if ($row['id'] > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

//end of fun

    /*     *
     * get 10 Ranking list
     * */

    function get_ranking_list() {

        $result = array();
        $query = "SELECT MAX(r.created_date) as date,r.user_id,u.google_name,u.projects,u.primary_project,u.google_picture_link as image,
                          sum(case when r.rating = 1 then 1  end) as pluscount,
                          sum(case when r.rating = 0 then 1  end) as minuscount
                          from rating as r join users as u ON (u.id =r.user_id) WHERE u.status <> 0 
                          group by r.user_id ORDER BY pluscount DESC, minuscount ASC,date ASC LIMIT 10";
        $ranking_data = $this->con->prepare($query);
        $ranking_data->execute();
        $rating = '';
        $name = '';
        $data = '';
        $flag = 'FALSE';
        $data = $ranking_data->fetchAll((PDO::FETCH_ASSOC));
        return $data;
    }

    /*     *
     * get 3 recent Ratings list
     * */

    function get_recent_ratings() {

        $MonthFirstDate = date('Y-m-01');
        $query = "SELECT r.user_id,u.google_name,u.google_picture_link,u.projects,u.primary_project,u.designation,if(c.comment_text <> '',c.comment_text,w.description) AS description"
                . " FROM rating as r LEFT JOIN work AS w ON (w.id =r.work_id)"
                . " LEFT JOIN comment AS c on (c.request_id = r.request_id) JOIN users AS u ON (u.id = r.user_id) WHERE description <> '' AND r.rating <> 0 ORDER BY r.created_date DESC LIMIT 4";
        $rank_data = $this->con->prepare($query);
        $rank_data->execute();
        $row = $rank_data->fetchAll((PDO::FETCH_ASSOC));

        return $row;
    }

    /*     *
     * get User rank_position .
     * */

    function get_my_rank_position($login_user_id) {

        $query = "SELECT MAX(r.created_date) as date, r.user_id,u.google_name,u.google_picture_link as image,
                       sum(case when r.rating = 1 then 1  end) as pluscount,
                       sum(case when r.rating = 0 then 1  end) as minuscount
                       from rating as r join users as u ON (u.id =r.user_id) WHERE u.status <> 0
                       group by r.user_id ORDER BY pluscount DESC, minuscount ASC,date ASC";
        $rank_data = $this->con->prepare($query);
        $rank_data->execute();
        $row = $rank_data->fetchAll((PDO::FETCH_ASSOC));
        $login_user_rank_position = array_search($login_user_id, array_column($row, 'user_id'));
        $result = array();
        $result['my_rank'] = (is_bool($login_user_rank_position) == false) ? $login_user_rank_position + 1 : '-';
        $result['total_user_count'] = $this->get_all_members_cnt()['totalusercnt'];
        return $result;
    }

    /*     *
     * get All Member count.
     * */

    function get_all_members_cnt() {

        $query = "SELECT count(*) as totalusercnt FROM users WHERE status <> 0";
        $user_data = $this->con->prepare($query);
        $user_data->execute();
        $row = $user_data->fetch((PDO::FETCH_ASSOC));
        if (isset($row) && !empty($row)) {
            return $row;
        }
    }

    /*     *
     * get User feedback by id.
     * */
    /*    function get_feedback_by_id($user_id) {

      $query = "SELECT feedback.feedback_to as feedback_to,feedback.feedback_from as feedback_from,feedback.id as id,feedback.feedback_description as description,feedback.created_date as created_date,user.google_name as given_by_name FROM feedback AS feedback LEFT JOIN users AS user ON user.id = feedback.feedback_from WHERE feedback.feedback_to= :user_id AND (feedback.response_parent=0 OR feedback.response_parent is NULL) ORDER BY feedback.created_date desc ";

      $user_list = $this->con->prepare($query);
      $user_list->execute(array(':user_id' => $user_id));
      $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
      return $row;

      } */



    /*     *
     * get User feedback by id.
     * */

    function get_feedback_by_id($user_id) {

        $query = "SELECT feedback.feedback_to as feedback_to,feedback.feedback_from as feedback_from,feedback.id as id,feedback.feedback_description as description,feedback.created_date as created_date,user.google_name as given_by_name,user.designation, user.google_picture_link  FROM feedback AS feedback LEFT JOIN users AS user ON user.id = feedback.feedback_from WHERE feedback.feedback_to= :user_id AND (feedback.response_parent=0 OR feedback.response_parent is NULL) ORDER BY feedback.created_date desc ";

        $user_list = $this->con->prepare($query);
        $user_list->execute(array(':user_id' => $user_id));
        $rows = $user_list->fetchAll((PDO::FETCH_ASSOC));
        foreach ($rows as $key => $row) {
            //echo $row['id']; die;
            $query2 = "SELECT response.id as replay_id,response.feedback_from as replay_from,user.google_name as from_name,response.feedback_description as description,response.created_date as created_date FROM feedback AS response  LEFT JOIN users AS user ON user.id = response.feedback_from  where response.response_parent =:user_id";

            $replay2 = $this->con->prepare($query2);
            $replay2->execute(array(':user_id' => $row['id']));
            $replys = $replay2->fetchAll((PDO::FETCH_ASSOC));
            //print_r($replys);
            $rows[$key]['reply'] = $replys;
        }
        return $rows;
    }

    /*     *
     * Add Feedback in database
     * */

    function addFeedback($data) {
        $dateTime = new \DateTime(null, new DateTimeZone('Asia/Kolkata'));
        $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");

        $feedback_insert_query = "INSERT INTO feedback(feedback_to, feedback_description, feedback_from, response_parent, created_date, modified_date) VALUES(:feedback_to,:feedback_description,:feedback_from,:response_parent,:created_date,:modified_date)";
        try {
            $feedback_insert = $this->con->prepare($feedback_insert_query);
            $feedback_insert->execute(array(
                ':feedback_to' => $data['feedback_to'],
                ':feedback_description' => $data['feedback_description'],
                ':feedback_from' => $data['feedback_from'],
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':response_parent' => null
            ));
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
            exit;
        }
        $work_last_insert = $this->con->lastInsertId();
        if ($work_last_insert) {
            $email_data = [];
            $user_data = $this->getEmailById($data['feedback_to']);
            $from_data = $this->getEmailById($data['feedback_from']);
            $temp_data = $this->getEmailTemplateByCode('PRKE22');
            $email_data['to']['email'] = $user_data['google_email'];
            $email_data['to']['name'] = $user_data['google_name'];
            $email_data['subject'] = $temp_data['subject'];
            $this->getParakhLink();

            $vars = array(
                "{Username}" => $email_data['to']['name'],
                "{Member}" => $from_data['google_name'],
                "{Parakh}" => $this->getParakhLink(),
                "{Feedback}" => $data['feedback_description'],
            );
            $message = strtr($temp_data['content'], $vars);
            $email_data['message'] = $message;
            $this->send_notification($email_data);

            // send notification to manager
            $email_data_l = [];
            $temp_data_l = $this->getEmailTemplateByCode('PRKE22');
            $email_data_l['to']['email'] = $this->manager_email;

            $email_data_l['to']['name'] = $this->manager_name;
            $email_data_l['subject'] = $temp_data_l['subject'];

            $vars = array(
                "{Member}" => $email_data['to']['name'],
                "{Lead}" => $from_data['google_name'],
                "{Feedback}" => $data['feedback_description'],
            );
            $message = strtr($temp_data_l['content'], $vars);
            $email_data_l['message'] = $message;
            $this->send_notification($email_data_l);


            /* update msg read count */
            $query = "SELECT msg_read from users where id=" . $data['feedback_to'];
            $user_list = $this->con->prepare($query);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {
                $query = "UPDATE users set msg_read=" . ($row[0]['msg_rea'] + 1) . " where id=" . $data['feedback_to'];
                $user_list = $this->con->prepare($query);
                $user_list->execute();
            }
        }
        return $work_last_insert;
    }

//end of fun

    /*     *
     * get get_all_team_members except given id (self id)
     * */

    function get_all_team_members($user_id) {
        if ($user_id) {
            $query = "SELECT id, google_name, google_email, mobile_number, designation, google_picture_link,location,skills,interests,associate_with_infobeans,projects,primary_project FROM users WHERE id <>:id AND id <> 1 AND status <> 0 ORDER BY google_name";
            
            $user_list = $this->con->prepare($query);
            $user_list->execute(array(':id' => $user_id));
            $employeeList = $user_list->fetchAll((PDO::FETCH_ASSOC));
            
            
            $id_array = array();
            foreach ($employeeList as $key => $value) {
               $id_array[] = $value['id'];
            }
            $id_array = implode(",",$id_array);

            $query_rank = "SELECT u.id,u.google_name,
                    sum(case when r.rating = 1 then 1  end) as pluscount,
                    sum(case when r.rating = 0 then 1  end) as minuscount
                    from rating as r join users as u ON (u.id =r.user_id) WHERE u.status <> 0 
                    group by r.user_id ORDER BY u.google_name";
                $user_rank = $this->con->prepare($query_rank);
                $user_rank->execute();
                $userRank = $user_rank->fetchAll((PDO::FETCH_ASSOC));

            foreach ($userRank as $key => $value) {
               $rank_array[$value['id']]['pluscount'] = $value['pluscount'];
               $rank_array[$value['id']]['minuscount'] = $value['minuscount'];
            }
            
            for($y=0;$y<count($employeeList);$y++)
            {
                if(isset($rank_array[$employeeList[$y]['id']]['pluscount']) && !empty($rank_array[$employeeList[$y]['id']]['pluscount']))
                {
                    $employeeList[$y]['pluscount'] = "+".$rank_array[$employeeList[$y]['id']]['pluscount'];
                }else
                {
                    $employeeList[$y]['pluscount'] = 0;
                }
                if(isset($rank_array[$employeeList[$y]['id']]['minuscount']) && !empty($rank_array[$employeeList[$y]['id']]['minuscount']))
                {
                    $employeeList[$y]['minuscount'] = "-".$rank_array[$employeeList[$y]['id']]['minuscount'];
                }else
                {
                    $employeeList[$y]['minuscount'] = 0;
                }
                
            }

            return $employeeList;
        } else {
            return 0;
        }
    }

    /*     *
     * save feedback responce
     * */

    function feedbackResponseSave($data) {

        $dateTime = new \DateTime(null, new DateTimeZone('Asia/Kolkata'));
        $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");

        $feedback_insert_query = "INSERT INTO feedback(feedback_to, feedback_description, feedback_from, response_parent, created_date, modified_date) VALUES(:feedback_to,:feedback_description,:feedback_from,:response_parent,:created_date,:modified_date)";

        $feedback_insert = $this->con->prepare($feedback_insert_query);
        $feedback_insert->execute(array(':feedback_to' => $data['feedback_to'],
            ':feedback_description' => $data['feedback_desc'],
            ':feedback_from' => $data['login_user_id'],
            ':response_parent' => $data['feedback_id'],
            ':created_date' => $created_date,
            ':modified_date' => $modified_date,
        ));

        /* send email to user when decline */
        if (isset($data['feedback_desc']) && !empty($data['feedback_desc'])) {
            $email_data = [];
            $user_data = $this->getEmailById($data['login_user_id']);
            $temp_data = $this->getEmailTemplateByCode('PRKE05');
            $email_data['to']['email'] = $user_data['google_email'];
            $email_data['to']['name'] = $user_data['google_name'];
            $email_data['subject'] = $temp_data['subject'];

            $vars = array(
                "{Username}" => $user_data['google_name'],
                "{Parakh}" => $this->getParakhLink(),
                "{Member}" => $user_data['google_name'],
                "{Comment}" => '"' . $data['feedback_desc'] . '"'
            );

            $message = strtr($temp_data['content'], $vars);
            $email_data['message'] = $message;
            $this->send_notification($email_data);

            // // send notification to manager
            if ($this->manager_email != $user_data['google_email']) {
                $email_data_l = [];
                $temp_data_l = $this->getEmailTemplateByCode('PRKE05');
                $email_data_l['to']['email'] = $this->manager_email;
                $email_data_l['to']['name'] = $this->manager_name;
                $email_data_l['subject'] = $temp_data_l['subject'];

                $message = strtr($temp_data['content'], $vars);
                $email_data_l['message'] = $message;
                $this->send_notification($email_data_l);
                print_r($email_data_l);die;
            }

            /* update msg read count */
            $query = "SELECT msg_read from users where id=" . $data['feedback_to'];
            $user_list = $this->con->prepare($query);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {
                $query = "UPDATE users set msg_read=" . ($row[0]['msg_rea'] + 1) . " where id=" . $data['feedback_to'];
                $user_list = $this->con->prepare($query);
                $user_list->execute();
            }
        }
        return true;
    }

    /*     *
     * Return details of all the managers and leads
     * */

    function getAllLeads($user_id) {
        if ($user_id) {
            $leadList = [];
            $query = "SELECT * FROM user_hierarchy WHERE user_id = :id ";
            $user_list = $this->con->prepare($query);
            $user_list->execute(array(':id' => $user_id));
            $leadList = $user_list->fetchAll((PDO::FETCH_ASSOC));

            if (isset($leadList) && !empty($leadList)) {
                foreach ($leadList as $key => $val) {
                    $user_query = "SELECT google_name,google_picture_link "
                            . "FROM users WHERE id = :id";
                    $manager_name = $this->con->prepare($user_query);
                    $manager_name->execute(array(':id' => $val['manager_id']));
                    $manager_name = $manager_name->fetch((PDO::FETCH_ASSOC));

                    $leadList[$key]['manager_name'] = $manager_name['google_name'];
                    $leadList[$key]['google_picture_link'] = $manager_name['google_picture_link'];

                    $role_query = "SELECT name FROM role_type "
                            . "WHERE id = :role_type_id";
                    $role_name = $this->con->prepare($role_query);
                    $role_name->execute(array(':role_type_id' => $val['role_type_id']));
                    $role_name = $role_name->fetch((PDO::FETCH_ASSOC));
                    $leadList[$key]['role_name'] = $role_name['name'];
                }
                return $leadList;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    /*     *
     * Use to add user request for one to lead or manager
     * */

    function requestForOne($data) {
        $dateTime = new \DateTime(null, new DateTimeZone('Asia/Kolkata'));
        $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
        $pending = 0;

        $data['work_title'] = "System generated"; // default value of work title
        $data['rating'] = 1; // default for request made by user to lead or manager

        $work_insert_query = "INSERT INTO work "
                . "(user_id,for_id,title,description,created_by,created_date,"
                . "modified_date,request_for, work_date)
                VALUES(:user_id,:for_id,:work_title,:work_description,
                :created_by,:created_date,:modified_date,:request_for,:work_date)";
        $work_insert = $this->con->prepare($work_insert_query);

        $work_insert->execute(array(':user_id' => $data['u_id'],
            ':for_id' => $data['l_id'],
            ':work_title' => $data['work_title'],
            ':work_description' => $data['desc'],
            ':created_by' => $data['u_id'],
            ':created_date' => $created_date,
            ':modified_date' => $modified_date,
            ':request_for' => $data['rating'],
            ':work_date' => $created_date));
        $work_last_insert = $this->con->lastInsertId();

        if (isset($data['l_id']) && !empty($data['l_id']) && ($data['l_id'] != -1)) {
			$read_status=0;
			$show_request=1;
            $request_insert_query = "INSERT INTO request(from_id,for_id,to_id,status," 
                    . "read_status,work_id,created_date,modified_date, show_request)
                    VALUES(:from_id,:for_id,:to_id,:status,:read_status,:work_id,:created_date,:modified_date,:show_request)";
            $request_insert = $this->con->prepare($request_insert_query);
            $run=$request_insert->execute(array(':from_id' => $data['u_id'],
                ':for_id' => $data['u_id'],
                ':to_id' => $data['l_id'],
                ':status' => $pending,
				':read_status'=>$read_status,
                ':work_id' => $work_last_insert,
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
				':show_request'=>$show_request));
				
				if($run)
            $request_last_insert = $this->con->lastInsertId();
		
            /* if (!empty($data)) {
              notifyRequestToManager($data);
              } */

            $email_data = [];
            $user_data = $this->getEmailById($data['l_id']);
            $temp_data = $this->getEmailTemplateByCode('PRKE13');
            $email_data['to']['email'] = $user_data['google_email'];
            $email_data['to']['name'] = $user_data['google_name'];
            $email_data['subject'] = $temp_data['subject'];

            $vars = array(
                "{Username}" => $user_data['google_name'],
                "{Parakh}" => $this->getParakhLink(),
            );

            $message = strtr($temp_data['content'], $vars);
            $email_data['message'] = $message;
            $this->send_notification($email_data);

            // // send notification to manager
            if ($this->manager_email != $user_data['google_email']) {
                $email_data_l = [];
                $email_data_l['to']['email'] = $this->manager_email;
                $email_data_l['to']['name'] = $this->manager_name;
                $email_data_l['subject'] = (!empty($temp_data_l['subject']))?$temp_data_l['subject']:"";

                $message = strtr($temp_data['content'], $vars);
                $email_data_l['message'] = $message;
                $this->send_notification($email_data_l);
            }

            /* update msg read count */
            $query = "SELECT msg_read from users where id=" . $data['u_id'];
            $user_list = $this->con->prepare($query);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {
                $query = "UPDATE users set msg_read=" . ($row[0]['msg_read'] + 1) . " where id=" . $data['u_id'];
                $user_list = $this->con->prepare($query);
                $user_list->execute();
            }

            return $request_last_insert;
        }
    }

//end of fun
    // Get all the requests available for any user
    function getTeamMembersRequest($user_id = null) {
        if (isset($user_id)) {
            $query = "SELECT user.google_name,user.google_picture_link,user.designation,request.id as request_id, "
                    . "request.to_id,request.from_id,request.status, request.for_id, description, "
                    . "work.created_date, request_for, work.id AS work_id "
                    . "FROM work AS work LEFT JOIN request AS request ON work.id = request.work_id "
                    . "LEFT JOIN  users AS user "
                    . "ON IF( work.user_id = work.for_id, request.from_id = user.id, "
                    . "request.for_id = user.id ) WHERE request.to_id = " . $user_id . " "
                    . "ORDER BY work.id DESC";
            $user_list = $this->con->prepare($query);
			var_dump($user_list);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
            /* if(count($row) > 0){
              return $row;
              }else{
              return 0;
              } */
        }
    }

//end of fun()

    function getUserPendingRequest($user_id, $status = 0) {
        if (isset($user_id)) {
            $cnd = '';
            if ($status != '')
                $cnd = " AND request.status = " . $status;
            $query = "select request.id as request_id, user.google_name,user.id as lead_id, "
                    . "user.google_picture_link, user.designation,role.name as role_name, "
                    . "request.to_id,request.from_id,description,"
                    . "work.created_date,request_for,rating, request.status "
                    . "from work as work left join "
                    . "request as request on work.id = request.work_id left join "
                    . "rating as rating on work.id=rating.work_id left join  "
                    . "users as user on request.to_id=user.id left join "
                    . "role_type as role on role.id = user.role_id "
                    . "where request.to_id = " . $user_id . $cnd . " order by work.modified_date desc";
            $user_list = $this->con->prepare($query);
			//echo($user_list->queryString);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

//end of fun
    // fun to approve or denied the request
    function requestDecision($data) {
        if ($data['st'] == 1) {
            return $this->acceptRequest($data);
        }
        if ($data['st'] == 0) {
            return $this->rejectRequest($data);
        }
    }

//end of fun

    function resetNotifCount($data) {
        $update__count_ = "Update users SET msg_read = 0 WHERE id = '" . $data['userId'] . "'";
        $work_Count = $this->con->prepare($update__count_);
        $work_Count->execute();
        return true;
    }

//end of fun

    function rejectRequest($data) {
        $dateTime = new \DateTime(null, new DateTimeZone('Asia/Kolkata'));
        $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
        $id = $data['rq_id'];
        $sql = "Update request SET show_request='1',status = '1', modified_date = '" . $modified_date . "' WHERE id = '" . $id . "'";
        $query = $this->con->prepare($sql);
        $data2 = $query->execute();
        $this->unread_request($id);
        $comment_inst = $this->get_comment_detail($data['rq_id']);
        $comment_insert_query = "INSERT INTO comment(request_id, comment_text, by_id, created_date, modified_date)
                                 VALUES(:request_id,:comment_text,:by_id,:created_date,:modified_date)";
        $comment_insert = $this->con->prepare($comment_insert_query);
        $comment_insert->execute(array(':request_id' => $id,
            ':comment_text' => $data['desc'],
            ':by_id' => $data['u_id'],
            ':created_date' => $created_date,
            ':modified_date' => $modified_date));
        //notifyRequestStatus($data, "decline");

        /* send email to user when decline */
        $email_data = [];
        $user_data = $this->getEmailById($data['u_id']);
        $temp_data = $this->getEmailTemplateByCode('PRKE04');
        $email_data['to']['email'] = $user_data['google_email'];
        $email_data['to']['name'] = $user_data['google_name'];
        $email_data['subject'] = $temp_data['subject'];

        $vars = array(
            "{Username}" => $user_data['google_name'],
            "{Parakh}" => $this->getParakhLink(),
        );

        $message = strtr($temp_data['content'], $vars);
        $email_data['message'] = $message;
        $this->send_notification($email_data);

        // // send notification to manager
        if ($this->manager_email != $user_data['google_email']) {
            $email_data_l = [];
            $email_data_l['to']['email'] = $this->manager_email;
            $email_data_l['to']['name'] = $this->manager_name;
            $email_data_l['subject'] = $temp_data_l['subject'];

            $message = strtr($temp_data['content'], $vars);
            $email_data_l['message'] = $message;
            $this->send_notification($email_data_l);
        }

        $update__work_ = "Update work SET description ='" . $data['desc'] . "', modified_date = '" . $modified_date . "' WHERE id = '" . $id . "'";
        $work_update = $this->con->prepare($update_comment);
        $work_update->execute();


        /* update msg read count */
        $query = "SELECT msg_read from users where id=" . $data['to_id'];
        $user_list = $this->con->prepare($query);
        $user_list->execute();
        $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
        if (isset($row) && !empty($row)) {
            $query = "UPDATE users set msg_read=" . ($row[0]['msg_read'] + 1) . " where id=" . $data['to_id'];
            $user_list = $this->con->prepare($query);
            $user_list->execute();
        }

        return true;
    }

//end of fun

    function acceptRequest($data) {

        $dateTime = new \DateTime(null, new DateTimeZone('Asia/Kolkata'));
        $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");

        $show = 1;
        $status = 2;

        $rating_inst = $this->get_rating_detail($data['rq_id']);
        $comment_inst = $this->get_comment_detail($data['rq_id']);
        $request_data = $this->get_request_detail($data['rq_id']);
        $email = false;

        $login_user_id = $data['u_id'];
        if (empty($rating_inst)) {
            $rating_insert_query = "INSERT INTO rating(request_id, work_id, user_id, rating, given_by, created_date, modified_date, show_rating)
                                    VALUES(:request_id,:work_id,:user_id,:rating,:given_by,:created_date,:modified_date,:show_rating)";
            $rating_insert = $this->con->prepare($rating_insert_query);
            $rating_insert->execute(array(':request_id' => $data['rq_id'],
                ':work_id' => $request_data['work_id'],
                ':user_id' => $data['to_id'],
                ':rating' => $data['st'],
                ':given_by' => $login_user_id,
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':show_rating' => $show));
            $email = true;
        } else {
            $rate = $data['rating'];
            $sql = "Update rating SET show_rating ='" . $show . "',rating = $rate,"
                    . "modified_date = '" . $modified_date . "' WHERE "
                    . "request_id = '" . $data['rq_id'] . "'";
            $query = $this->con->prepare($sql);
            $data2 = $query->execute();
            $email = true;
        }
        if (empty($comment_inst)) {
            $comment_insert_query = "INSERT INTO comment(request_id, comment_text, by_id, created_date, modified_date)
                                    VALUES(:request_id,:comment_text,:by_id,:created_date,:modified_date)";
            $comment_insert = $this->con->prepare($comment_insert_query);
            $comment_insert->execute(array(':request_id' => $data['rq_id'],
                ':comment_text' => $data['desc'],
                ':by_id' => $data['u_id'],
                ':created_date' => $created_date,
                ':modified_date' => $modified_date));
        } else {
            $update_comment = "Update comment SET comment_text ='" . $data['desc'] . "', modified_date = '" . $modified_date . "' WHERE request_id = '" . $data['rq_id'] . "'";
            $query_comment = $this->con->prepare($update_comment);
            $comment_update_data = $query_comment->execute();
        }
        $sql = "Update work SET description='" . $data['desc'] . "' WHERE id = '" . $request_data['work_id'] . "'";
        $query = $this->con->prepare($sql);
        $data2 = $query->execute();
        //notifyRequestStatus($data, "approve");
        $sql = "Update request SET show_request ='" . $show . "',status = '" . $status . "', "
                . "modified_date = '" . $modified_date . "' WHERE id = '" . $data['rq_id'] . "'";
        $query = $this->con->prepare($sql);
        $data2 = $query->execute();
        /* send email to user when accept */
        if ($email) {

            $email_data = [];
            $user_data = $this->getEmailById($data['u_id']);
            $temp_data = $this->getEmailTemplateByCode('PRKE03');
            $email_data['to']['email'] = $user_data['google_email'];
            $email_data['to']['name'] = $user_data['google_name'];
            $email_data['subject'] = $temp_data['subject'];

            $vars = array(
                "{Username}" => $user_data['google_name'],
                "{Parakh}" => $this->getParakhLink(),
            );

            $message = strtr($temp_data['content'], $vars);
            $email_data['message'] = $message;
            $this->send_notification($email_data);

            // // send notification to manager
            if ($this->manager_email != $user_data['google_email']) {
                $email_data_l = [];
                $email_data_l['to']['email'] = $this->manager_email;
                $email_data_l['to']['name'] = $this->manager_name;
                $email_data_l['subject'] = $temp_data_l['subject'];

                $message = strtr($temp_data['content'], $vars);
                $email_data_l['message'] = $message;
                $this->send_notification($email_data_l);
            }

            /* update msg read count */
            $query = "SELECT msg_read from users where id=" . $data['to_id'];
            $user_list = $this->con->prepare($query);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {
                $query = "UPDATE users set msg_read=" . ($row[0]['msg_rea'] + 1) . " where id=" . $data['to_id'];
                $user_list = $this->con->prepare($query);
                $user_list->execute();
            }
        }

        return true;
    }

//end of fun

    function unread_request($request_id = null) {
        $query = "UPDATE request SET read_status = '1' WHERE id = :id";
        $update_status = $this->con->prepare($query);
        $update_status = $update_status->execute(array(':id' => $request_id));
        return $update_status;
    }

    function get_rating_detail($request_id) {
        $query = "SELECT * FROM rating WHERE request_id = :request_id";
        $status = $this->con->prepare($query);
        $status->execute(array(':request_id' => $request_id));
        $row = $status->fetch((PDO::FETCH_ASSOC));
        return $row;
    }

//end of fun

    function get_request_detail($request_id) {
        $query = "SELECT * FROM request WHERE id = :request_id";
        $status = $this->con->prepare($query);
        $status->execute(array(':request_id' => $request_id));
        $row = $status->fetch((PDO::FETCH_ASSOC));
        return $row;
    }

//end of fun

    function get_comment_detail($request_id) {
        $query = "SELECT * FROM comment WHERE request_id = :request_id";
        $status = $this->con->prepare($query);
        $status->execute(array(':request_id' => $request_id));
        $row = $status->fetch((PDO::FETCH_ASSOC));
        return $row;
    }

    function getRecentActivity($user_id) {
        $query = "SELECT * FROM (SELECT r.user_id AS user_id,re.for_id,
                     re.status,r.given_by AS given_by,u.google_name AS ratedby,
                     u1.google_name AS rated_to,IF(r.rating = 1, '+1', '-1') AS rating,
                     u.google_picture_link,u1.google_picture_link AS for_picture,
                     r.modified_date AS created_date FROM rating AS r
                     JOIN request re ON re.id = r.request_id JOIN users AS u ON u.id = r.user_id
                     JOIN users AS u1 ON u1.id = r.given_by
                     WHERE r.user_id = :user_id OR r.given_by = :user_id
                     AND re.for_id IS NULL
                     UNION 
                     SELECT re.to_id,re.for_id,re.status,re.from_id,u.google_name,u1.google_name AS ratedby,
                     IF(re.status = 1, 'declined', 'approved') AS rating,u.google_picture_link,
                     u1.google_picture_link AS for_picture,re.modified_date AS created_date
                     FROM `request` AS re JOIN users AS u ON (u.id = re.to_id)
                     JOIN users AS u1 ON u1.id = re.for_id WHERE re.for_id = :user_id
                     OR re.to_id = :user_id ORDER BY created_date DESC) AS d
                     WHERE status <> 0 AND (user_id <> for_id OR for_id IS NULL)ORDER BY d.created_date DESC
                     ";
        $user_list = $this->con->prepare($query);
        $user_list->execute(array(':user_id' => $user_id));
        $row = $user_list->fetchAll((PDO::FETCH_ASSOC));

        /* query for feedback */
        $query1 = "SELECT feedback.feedback_to as user_id,feedback.feedback_to as for_id, 3 as status,'response-feedback' as rating,feedback_from as given_by,users.google_name as rated_to,google_picture_link, feedback.created_date  from users join feedback on feedback.feedback_to = users.id where feedback.feedback_to = :user_id";
        $user_list1 = $this->con->prepare($query1);
        $user_list1->execute(array(':user_id' => $user_id));
        $row1 = $user_list1->fetchAll((PDO::FETCH_ASSOC));
        for ($p = 0; $p < count($row1); $p++) {
            $query2 = "SELECT id,google_name,google_picture_link from users where users.id = :user_id";
            $user_list2 = $this->con->prepare($query2);
            $user_list2->execute(array(':user_id' => $row1[$p]['given_by']));
            $row2 = $user_list2->fetchAll((PDO::FETCH_ASSOC));
            $row1[$p]['for_picture'] = $row2[0]['google_picture_link'];
            $row1[$p]['ratedby'] = $row2[0]['google_name'];
            $row[] = $row1[$p];
        }

            /*query for feedback response*/
            $query3 = "SELECT feedback.feedback_from as user_id,feedback.feedback_from as for_id, 3 as status,'feedback' as rating,feedback_to as given_by,users.google_name as rated_to,google_picture_link, feedback.created_date  from users join feedback on feedback.feedback_from = users.id where feedback.feedback_from = :user_id"; 
            $user_list3 = $this->con->prepare($query3);
            $user_list3->execute(array(':user_id' => $user_id));
            $row3 = $user_list3->fetchAll((PDO::FETCH_ASSOC));
            for ($t=0;$t<count($row3);$t++) { 
                $query4 = "SELECT id,google_name,google_picture_link from users where users.id = :user_id"; 
                $user_list4 = $this->con->prepare($query4);
                $user_list4->execute(array(':user_id' => $row3[$t]['given_by']));
                $row4 = $user_list4->fetchAll((PDO::FETCH_ASSOC));
                $row3[$p]['for_picture'] = $row4[0]['google_picture_link'];
                $row3[$p]['ratedby'] = $row4[0]['google_name'];
                $row[] = $row3[$p];
            }
            usort($row, function($a, $b) {
                if($a['created_date']==$b['created_date']) return 0;
                return $a['created_date'] < $b['created_date']?1:-1;
            });
            return $row;        
    }//end of fun
    

    function sortFunction($a, $b) {
        return strtotime($a["created_by"]) - strtotime($b["created_by"]);
    }

    /* function to return unread notification count */

    function get_count_for_unread_notification($user_id) {
        $query = "SELECT msg_read FROM users where id =:user_id";
        $user_list = $this->con->prepare($query);
        $user_list->execute(array(':user_id' => $user_id));
        $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
        return $row;
    }

    //
    function getPendingRequest($user_id = null) {
        return 0;
    }

    /*get top four ranker of current month*/
    function get_top_four_ranker_for_current_month(){

        $query_rank = "SELECT r.created_date as date,r.user_id,u.google_name,u.primary_project,u.projects,u.google_picture_link as image,
                    sum(case when r.rating = 1 then 1  end) as pluscount,
                    sum(case when r.rating = 0 then 1  end) as minuscount
                    from rating as r join users as u ON (u.id =r.user_id) WHERE u.status <> 0 AND MONTH(r.created_date) = MONTH(CURDATE())
                    AND YEAR(r.created_date) = YEAR(CURDATE())
                    group by r.user_id ORDER BY pluscount DESC, minuscount ASC,date ASC LIMIT 4";
                $user_rank = $this->con->prepare($query_rank);
                $user_rank->execute();
                $userRank = $user_rank->fetchAll((PDO::FETCH_ASSOC));
                return $userRank;
    }

    /*get top ranker of project wise*/
    function get_top_rankers_project_wise($manager_id){

       $query_rank = "SELECT MAX(r.created_date) as date,r.user_id,u.google_name,u.google_picture_link as image,u.projects,u.primary_project,
                   sum(case when r.rating = 1 then 1  end) as pluscount,
                   sum(case when r.rating = 0 then 1  end) as minuscount
                   from rating as r join users as u ON (u.id =r.user_id) WHERE u.status <> 0 
                   and u.id in (SELECT user_id from user_hierarchy where manager_id = :manager_id) AND u.primary_project!='' group by u.primary_project ORDER BY pluscount DESC, minuscount ASC,date ASC";
               $user_rank = $this->con->prepare($query_rank);
               $user_rank->execute(array(':manager_id' => $manager_id));
               $userRank = $user_rank->fetchAll((PDO::FETCH_ASSOC));
               $totalUserRank = array();
               for ($k=0;$k<count($userRank);$k++) {
                   if(array_key_exists($userRank[$k]['primary_project'],$totalUserRank))
                   {   
                       $comma_array = explode(",",$totalUserRank[$userRank[$k]['primary_project']]);
                       $comma_array[1] = $comma_array[1]+$userRank[$k]['pluscount'];
                       $comma_array[2] = $comma_array[2]+$userRank[$k]['minuscount'];
                       $totalUserRank[$userRank[$k]['primary_project']] = implode(",",$comma_array);
                   }else
                   {
                       if($userRank[$k]['pluscount']=='')
                       {
                           $userRank[$k]['pluscount'] = 0;
                       }
                       if($userRank[$k]['minuscount']=='')
                       {
                           $userRank[$k]['minuscount'] = 0;
                       }
                       $totalUserRank[$userRank[$k]['primary_project']] = $userRank[$k]['primary_project'].",".$userRank[$k]['pluscount'].",".$userRank[$k]['minuscount'];
                   }
               }
               $new_array = array();
               foreach ($totalUserRank as $key => $value) {
                   $new_array[] = $value;
               }
               return $new_array;
   }

    /*get top ranker of calendar wise*/
    function get_top_rankers_calendar_wise($lead_id){

        $totalUserRank = array();
        /*Query to fetch plus and minus week wise*/
        $query_rank_week_wise = "SELECT sum(case when r.rating = 1 then 1  end) as pluscount,sum(case when r.rating = 0 then 1  end) as minuscount FROM rating as r WHERE created_date > DATE_SUB(NOW(), INTERVAL 1 WEEK) AND user_id in (select user_id from user_hierarchy where manager_id =:lead_id) ";
        $user_rank_week = $this->con->prepare($query_rank_week_wise);
        $user_rank_week->execute(array(':lead_id' => $lead_id));
        $userRankWeek = $user_rank_week->fetchAll((PDO::FETCH_ASSOC));
        for ($k=0;$k<count($userRankWeek);$k++) { 
            $totalUserRank['week']['plus'] = ($userRankWeek[$k]['pluscount']!='')?$userRankWeek[$k]['pluscount']:0;
            $totalUserRank['week']['minus'] = ($userRankWeek[$k]['minuscount']!='')?$userRankWeek[$k]['minuscount']:0;
        }
        /*Query to fetch plus and minus month wise*/
        $query_rank_month_wise = "SELECT sum(case when r.rating = 1 then 1  end) as pluscount,   sum(case when r.rating = 0 then 1  end) as minuscount FROM rating as r WHERE created_date > DATE_SUB(NOW(), INTERVAL 1 MONTH) AND user_id in (select user_id from user_hierarchy where manager_id =:lead_id) ";
        $user_rank_month = $this->con->prepare($query_rank_month_wise);
        $user_rank_month->execute(array(':lead_id' => $lead_id));
        $userRankMonth = $user_rank_month->fetchAll((PDO::FETCH_ASSOC));
        for ($k=0;$k<count($userRankMonth);$k++) { 
            $totalUserRank['month']['plus'] = ($userRankMonth[$k]['pluscount']!='')?$userRankMonth[$k]['pluscount']:0;
            $totalUserRank['month']['minus'] = ($userRankMonth[$k]['minuscount']!='')?$userRankMonth[$k]['minuscount']:0;
        }
        /*Query to fetch plus and minus till today*/
         $query_rank_till_now_wise = "SELECT sum(case when r.rating = 1 then 1  end) as pluscount,sum(case when r.rating = 0 then 1  end) as minuscount FROM rating as r WHERE user_id in (select user_id from user_hierarchy where manager_id =:lead_id)";
       $user_rank_till_now = $this->con->prepare($query_rank_till_now_wise);
       $user_rank_till_now->execute(array(':lead_id' => $lead_id));
        $userRankTillNow = $user_rank_till_now->fetchAll((PDO::FETCH_ASSOC));
        for ($k=0;$k<count($userRankTillNow);$k++) { 
            $totalUserRank['till_now']['plus'] = ($userRankTillNow[$k]['pluscount']!='')?$userRankTillNow[$k]['pluscount']:0;
            $totalUserRank['till_now']['minus'] = ($userRankTillNow[$k]['minuscount']!='')?$userRankTillNow[$k]['minuscount']:0;
        }
        return $totalUserRank;
    }

    /*get all projects*/
    function get_all_projects()
    {
        $query = "SELECT * FROM projects";
                $all_projects = $this->con->prepare($query);
                $all_projects->execute();
                $allProjects = $all_projects->fetchAll((PDO::FETCH_ASSOC));
                return $allProjects;
    }

    /*get all interests*/
    function get_all_interests()
    {
        $query = "SELECT * FROM interests";
                $all_interests = $this->con->prepare($query);
                $all_interests->execute();
                $allInterests = $all_interests->fetchAll((PDO::FETCH_ASSOC));
                return $allInterests;
    }

    /*get all designations*/
    function get_all_designations()
    {
        $query = "SELECT * FROM designations";
                $all_designations = $this->con->prepare($query);
                $all_designations->execute();
                $allDesignations = $all_designations->fetchAll((PDO::FETCH_ASSOC));
                return $allDesignations;
    }
//end of fun
}

//end of class
