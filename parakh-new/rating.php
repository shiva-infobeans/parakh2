<?php

/**
 * Description of rating
 *
 * @author
 */
class rating {

    public $user = DB_USERNAME;
    public $pass = DB_PASSWORD;
    public $host = DB_HOST;
    public $dbname = DB_NAME;

    // Tables name and columns constants
    /**
     * constants for tblDocument table and its column
     */
    const TAB_USER = "users";
    const COL_TAB_USER_ID = "id";
    const COL_TAB_USER_ROLE_ID = "role_id";
    const COL_TAB_USER_EMAIL = "google_email";
    const COL_TAB_USER_STATUS = "status";
    //const COL_TAB_USER_TITLE = "Title";
    const TAB_USER_HIERARCHY = "user_hierarchy";
    const TAB_USER_HIERARCHY_id = "user_id";
    const TAB_USER_HIERARCHY_manager_id = "manager_id";
    const TAB_USER_HIERARCHY_role_type_id = "role_type_id";
    const TAB_ROLE_TYPE = "role_type";
    const TAB_ROLE_TYPE_ID = "id";
    const COL_TAB_ROLE_TYPE_NAME = "name";
    const COL_TAB_ROLE_TYPE_SN = "short_name";
    const TAB_WORK = "work";
    const TAB_WORK_ID = "id";
    const TAB_WORK_USER_ID = "user_id";
    const TAB_WORK_FOR_ID = "for_id";
    const TAB_WORK_TITLE = "title";
    const TAB_WORK_DESCRIPTION = "description";
    const TAB_WORK_CREATED_BY = "created_by";
    const TAB_WORK_CREATED_DATE = "created_date";
    const TAB_WORK_MODIFIED_DATE = "modified_date";
    const TAB_REQUEST = "request";
    const TAB_REQUEST_ID = "id";
    const TAB_REQUEST_FROM_ID = "from_id";
    const TAB_REQUEST_TO_ID = "to_id";
    const TAB_REQUEST_STATUS = "status";
    const TAB_REQUEST_WORK_ID = "work_id";
    const TAB_REQUEST_READ_STATUS = "read_status";
    const TAB_REQUEST_CREATED_DATE = "created_date";
    const TAB_REQUEST_MODIFIED_DATE = "modified_date";
    const TAB_RATING = "rating";
    const TAB_RATING_ID = "id";
    const TAB_RATING_REQUEST_ID = "request_id";
    const TAB_RATING_WORK_ID = "work_id";
    const TAB_RATING_USER_ID = "user_id";
    //const TAB_RATING_RATING_PLUS = "rating_plus";
    const TAB_RATING_GIVEN_BY = "given_by";
    const TAB_RATING_RATING = "rating";
    const TAB_RATING_CREATED_DATE = "created_date";
    const TAB_RATING_MODIFIED_DATE = "modified_date";
    const TAB_COMMENT = "comment";
    const TAB_COMMENT_ID = "id";
    const TAB_COMMENT_REQUEST_ID = "request_id";
    const TAB_COMMENT_TEXT = "comment_text";
    const TAB_COMMENT_BY_ID = "by_id";
    const TAB_COMMENT_CREATED_DATE = "created_date";
    const TAB_COMMENT_MODIFIED_DATE = "modified_date";
    const TAB_STATUS = "status";
    const TAB_STATUS_ID = "id";
    const TAB_STATUS_TYPE = "type";
    const TAB_STATUS_VALUE = "value";
    /* Priyesh  */
    const COL_TAB_REQUEST_WORK_ID = "work_id";
    const COL_TAB_WORK_ID = "id";
    const TAB_WORK_REQUEST_FOR = "request_for";
    const TAB_WORK_WORK_DATE = "work_date";
    const TAB_REQUEST_SHOW = "show_request";
    const TAB_RATING_SHOW_RATING = "show_rating";
    const ADMIN_LOGIN_EMAILID = "fatima.sayed@infobeans.com";
    const ADMIN_LOGIN_PASSWORD = "12345";
    /***** User Log ******************/
    const TAB_USER_LOG = "user_log";
    const COL_USER_LOG_ID = "id";
    const COL_USER_LOG_USERID = "user_id";
    const COL_USER_LOG_LOGINDATETIME = "login_datetime";
    const COL_USER_LOG_LOGOUTDATETIME = "logout_datetime";
    /***** User Log ******************/
    /******* Feedback ***************/
    const TAB_FEEDBACK = "feedback";
    const TAB_FEEDBACK_FROM = "feedback_from";
    const TAB_FEEDBACK_TO = "feedback_to";
    const TAB_FEEDBACK_RESPONSE_PARENT = "response_parent";
    const TAB_FEEDBACK_DESCRIPTION = "feedback_description";
    const TAB_FEEDBACK_CREATED_DATE = "created_date";
    const TAB_FEEDBACK_MODIFIED_DATE = "modified_date";
    /******* Feedback ***************/
    
    function get_connection() {
        try {
            $dbh = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->dbname, $this->user, $this->pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            $dbh->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_NATURAL);
            return $dbh;
        } catch (PDOException $e) {
            return NULL;
        }
    }

    function reminder_add_reason($days_interval = 0) {
        $dbh = $this->get_connection();

        $today = date('Y-m-d 23:59:59', strtotime("-1 days"));
        if ($dbh) {
            $query = "SELECT r.*, u.google_name as tm_name"
                    . "  FROM " . self::TAB_RATING . " as r "
                    . " INNER JOIN " . self::TAB_WORK . " as w"
                    . " ON r.work_id = w.id "
                    . " LEFT JOIN " . self::TAB_USER . " as u"
                    . " ON r.user_id = u.id"
                    . " INNER JOIN " . self::TAB_USER_HIERARCHY . " as uh"
                    . " ON r.user_id = uh.user_id"
                    . " WHERE w.title = 'System generated' "
                    . " AND TRIM(w.description) = '' "
                    . " AND r.given_by= uh.manager_id"
                    . " AND u.status=1";

            $query .= "  AND DATEDIFF('" . $today . "',r.created_date ) >= " . $days_interval;
            $query .= "  ORDER BY r.given_by ASC, u.google_name ASC, r.created_date ASC";
            $record_list = $dbh->prepare($query);
            $record_list->execute();
            $row = $record_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function revert_expired_award_one($days_interval = 10) {
        $data = $this->reminder_add_reason($days_interval);
        $total_record = count($data);
        $dbh = $this->get_connection();
        if ($total_record > 0 && $dbh) {
            for ($i = 0; $i < $total_record;) {
                $request_query = "DELETE FROM " . self::TAB_REQUEST
                        . " WHERE " . self::TAB_REQUEST_ID . " = :id";
                $request_data = $dbh->prepare($request_query);
                $request_data->execute(array(':id' => $data[$i]['request_id']));

                $work_query = "DELETE FROM " . self::TAB_WORK
                        . " WHERE " . self::TAB_WORK_ID . " = :id";
                $work_data = $dbh->prepare($work_query);
                $work_data->execute(array(':id' => $data[$i]['work_id']));

                $rating_query = "DELETE FROM " . self::TAB_RATING
                        . " WHERE " . self::TAB_RATING_ID . " = :id";
                $rating_data = $dbh->prepare($rating_query);
                $rating_data->execute(array(':id' => $data[$i]['id']));
                $i++;
            }
        } else
            echo "No records found to revert award one.";
    }

    function get_status() {

        $dbh = $this->get_connection();
        if ($dbh) {
            $return_data = array();
            $query = "SELECT * FROM " . self::TAB_STATUS;
            $status = $dbh->prepare($query);
            $status->execute();
            $row = $status->fetchAll((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {
                foreach ($row as $key => $val) {
                    $return_data[$val['value']] = $val['type'];
                }
                return $return_data;
            } else {
                return 0;
            }
        }
    }

    function get_profile($user_id) {
        $dbh = $this->get_connection();
        if ($dbh) {

            $query = "SELECT * FROM " . self::TAB_USER . " WHERE " . self::COL_TAB_USER_ID . " = :id";
            $profile_data = $dbh->prepare($query);
            $profile_data->execute(array(':id' => $user_id));
            $row = $profile_data->fetch((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {
                return $row;
            } else {
                return 0;
            }
        }
    }

    function edit_profile() {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (!empty($_SESSION['userinfo'])) {
                $query = "SELECT * FROM " . self::TAB_USER . " WHERE " . self::COL_TAB_USER_ID . " = :id";
                $profile_data = $dbh->prepare($query);
                $profile_data->execute(array(':id' => $_SESSION['userinfo']->id));
                $row = $profile_data->fetch((PDO::FETCH_ASSOC));
                if (isset($row) && !empty($row)) {
                    return $row;
                } else {
                    return 0;
                }
            }
        }
    }

    function update_profile($key, $value, $data) {
        $dbh = $this->get_connection();
        if ($dbh) {
            foreach ($data as $key => $val) {
                $update_data .= "$key = '" . $val . "', ";
            }
            $update_data = rtrim($update_data, ', ');
            $query = "UPDATE " . self::TAB_USER . " SET $update_data WHERE id = :id";
            $update_profile_data = $dbh->prepare($query);
            $query_result = $update_profile_data->execute(array(':id' => $_SESSION['userinfo']->id));
            return $query_result;
        }
    }

    function get_user_list($id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (isset($id)) {
                $role_type = "SELECT id FROM " . self::TAB_ROLE_TYPE . " WHERE " . self::COL_TAB_ROLE_TYPE_SN . " = 'TL' OR " . self::COL_TAB_ROLE_TYPE_SN . " = 'M'";
                $role_id = $dbh->prepare($role_type);
                $role_id->execute();
                $role_type_id = $role_id->fetchAll((PDO::FETCH_ASSOC));
                $ids = '';
                if (count($role_type_id) > 0) {
                    foreach ($role_type_id as $val) {
                        $ids .= $val['id'] . ",";
                    }

                    $ids = substr($ids, 0, -1);
                }
                $query = "SELECT * FROM " . self::TAB_USER . " WHERE id != :id AND role_id in ( " . $ids . " ) ORDER BY google_name Asc";
                $user_list = $dbh->prepare($query);
                $user_list->execute(array(':id' => $id));
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            } else {
                $query = "SELECT * FROM " . self::TAB_USER . " ORDER BY google_name Asc";
                $user_list = $dbh->prepare($query);
                $user_list->execute();
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }
    
    function get_user_list_admin($id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (isset($id)) {
                $role_type = "SELECT id FROM " . self::TAB_ROLE_TYPE . " WHERE " . self::COL_TAB_ROLE_TYPE_SN . " = 'TL' OR " . self::COL_TAB_ROLE_TYPE_SN . " = 'M'";
                $role_id = $dbh->prepare($role_type);
                $role_id->execute();
                $role_type_id = $role_id->fetchAll((PDO::FETCH_ASSOC));
                $ids = '';
                if (count($role_type_id) > 0) {
                    foreach ($role_type_id as $val) {
                        $ids .= $val['id'] . ",";
                    }

                    $ids = substr($ids, 0, -1);
                }
                $query = "SELECT * FROM " . self::TAB_USER . " WHERE id != :id AND status = 1  AND role_id in ( " . $ids . " ) ORDER BY google_name Asc";
                $user_list = $dbh->prepare($query);
                $user_list->execute(array(':id' => $id));
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            } else {
                $query = "SELECT * FROM " . self::TAB_USER . " ORDER BY google_name Asc";
                $user_list = $dbh->prepare($query);
                $user_list->execute();
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }

    function assigned_role($data, $old_lead = null) {

        $dbh = $this->get_connection();

        if ($dbh) {
            $user_role_sql = "UPDATE " . self::TAB_USER . " SET role_id = " . $data['role_id'] . " where id = " . $data['current_user']['user_id'];
            $user_role_query = $dbh->prepare($user_role_sql);
            $user_role_query->execute();
            $flag = 0;
            $sql_inst = "INSERT INTO " . self::TAB_USER_HIERARCHY . "(user_id,manager_id,role_type_id) VALUES ";
            foreach ($data['assigned_role'] as $key => $val) {
                $sql = "DELETE FROM " . self::TAB_USER_HIERARCHY . " WHERE " .
                        self::TAB_USER_HIERARCHY_id . " = " . $data['current_user']['user_id'] . " AND " . self::TAB_USER_HIERARCHY_role_type_id . " = " . $key . " ";
                $query = $dbh->prepare($sql);
                $datas = $query->execute(array(':user_id' => $data['current_user']['user_id'], ':role_type_id' => $key));
                if ($val != '-1') {
                    $flag = true;
                    $sql_inst .= "('" . $data['current_user']['user_id'] . "','" . $val . "','" . $key . "'),";
                }
                $flag = 1;
            }
            $sql_inst = rtrim($sql_inst, ',');
            if ($flag) {
                $query = $dbh->prepare($sql_inst);
                $datas = $query->execute();
            }
            return true;
        }
    }

    function get_all_role($flag = null) {

        $dbh = $this->get_connection();
        if ($dbh) {
            $return_data = array();
            $query = "SELECT * FROM " . self::TAB_ROLE_TYPE;
            $user_list = $dbh->prepare($query);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            if (isset($flag)) {
                foreach ($row as $key => $val) {
                    $return_data[$val['id']] = $val['name'];
                }
                return $return_data;
            }
            return $row;
        }
    }

    function get_all_role_for_admin($flag = null) {

        $dbh = $this->get_connection();
        if ($dbh) {
            $return_data = array();
            $query = "SELECT * FROM " . self::TAB_ROLE_TYPE . " WHERE " . self::TAB_ROLE_TYPE_ID . " NOT IN (8,9)";
            $user_list = $dbh->prepare($query);
            $user_list->execute();
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            if (isset($flag)) {
                foreach ($row as $key => $val) {
                    $return_data[$val['id']] = $val['name'];
                }
                return $return_data;
            }
            return $row;
        }
    }

    function get_all_lead($user_id, $flag = null, $group_by_flag = '1') {
        $dbh = $this->get_connection();
        if ($dbh) {
            $return_data = array();
            $group_by = '';
            if ($group_by_flag) {
                $group_by = "group by " . self::TAB_USER_HIERARCHY_manager_id;
            }
            $query = "SELECT * FROM " . self::TAB_USER_HIERARCHY . " WHERE " . self::TAB_USER_HIERARCHY_id . " = :id  " . $group_by;
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':id' => $user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));

            if (isset($row) && !empty($row)) {

                foreach ($row as $key => $val) {
                    $user_query = "SELECT google_name,google_picture_link FROM " . self::TAB_USER . " WHERE " . self::COL_TAB_USER_ID . " = :id";
                    $manager_name = $dbh->prepare($user_query);
                    $manager_name->execute(array(':id' => $val['manager_id']));
                    $manager_name = $manager_name->fetch((PDO::FETCH_ASSOC));

                    $row[$key]['manager_name'] = $manager_name['google_name'];
                    $row[$key]['google_picture_link'] = $manager_name['google_picture_link'];
                    $role_query = "SELECT name FROM " . self::TAB_ROLE_TYPE . " WHERE " . self::TAB_ROLE_TYPE_ID . " = :role_type_id";
                    $role_name = $dbh->prepare($role_query);
                    $role_name->execute(array(':role_type_id' => $val['role_type_id']));
                    $role_name = $role_name->fetch((PDO::FETCH_ASSOC));
                    $row[$key]['role_name'] = $role_name['name'];
                }
                if (isset($flag)) {
                    foreach ($row as $key => $val) {
                        $return_data[$val['role_type_id']] = $val['manager_id'];
                    }
                    return $return_data;
                }
                return $row;
            } else {
                return 0;
            }
        }
    }

    function is_profile_access_allowed($user_id, $lead_id) {
        $dbh = $this->get_connection();
        if ($dbh) {

            $member_ids = $this->get_my_team_mem($lead_id);
            $member_ids = rtrim($member_ids, ',');
            $query = "SELECT id FROM " . self::TAB_USER . " WHERE id IN ($member_ids ) AND id =  $user_id";
            $member_list = $dbh->prepare($query);
            $member_list->execute(array(':id' => $user_id, ':lead_id' => $lead_id));
            $row = $member_list->fetchAll((PDO::FETCH_ASSOC));
            return (isset($row) && !empty($row)) ? true : false;
        }
    }

    function get_all_member($lead_id) {

        $dbh = $this->get_connection();
        if ($dbh) {
            //   $query = "SELECT DISTINCT uh.user_id, uh.manager_id FROM " . self::TAB_USER_HIERARCHY . " as uh JOIN " . self::TAB_USER . " u ON uh.user_id=u.id WHERE   u.status =1 AND  uh.manager_id = :id";

            $query = "SELECT user_id from "
                    . self::TAB_USER_HIERARCHY . " WHERE manager_id IN "
                    . "(SELECT uh.user_id FROM " . self::TAB_USER_HIERARCHY . " "
                    . "as uh JOIN " . self::TAB_USER . " u ON uh.user_id=u.id WHERE 
                                                        u.status =1 AND  uh.manager_id = :id GROUP BY uh.user_id) 
                                                        UNION
                                                        SELECT uh.user_id FROM "
                    . self::TAB_USER_HIERARCHY . " as uh JOIN " . self::TAB_USER . " u ON "
                    . "uh.user_id=u.id WHERE   u.status =1 AND  uh.manager_id = :id GROUP BY uh.user_id";
            $member_list = $dbh->prepare($query);
            $member_list->execute(array(':id' => $lead_id));
            $row = $member_list->fetchAll((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {

                foreach ($row as $key => $val) {
                    $user_query = "SELECT google_name FROM " . self::TAB_USER . " WHERE status=1 AND " . self::COL_TAB_USER_ID . " = :id";
                    $manager_name = $dbh->prepare($user_query);
                    $manager_name->execute(array(':id' => $val['user_id']));
                    $manager_name = $manager_name->fetch((PDO::FETCH_ASSOC));
                    $row[$key]['user_name'] = $manager_name['google_name'];
                }
            }
            return $row;
        }
    }

    function get_all_member_custom() {
        $dbh = $this->get_connection();
        $users = array();
        if ($dbh) {
            $user_query = "SELECT u.id, u.id AS user_id, u.google_name AS name, u.google_email, u.google_picture_link FROM " . self::TAB_USER . " u WHERE u.status = 1 AND u.role_id = 9";
            $users = $dbh->prepare($user_query);
            $users->execute();
            $users = $users->fetchAll();
        }
        return $users;
    }

    function save_manager_work($data) {

        $dbh = $this->get_connection();
        if ($dbh) {
            $dateTime = new \DateTime();
            $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
            $login_user_id = $_SESSION['userinfo']->id;
            $workdate = '';
            if ($data['work_date'] != '' || !empty($data['work_date'])) {
                $workdate = date('Y-m-d H:i:s', strtotime($data['work_date']));
            }
            if ($data['save'] == 'Save') {
                $show = 0;
                $approved = 0;
            }
            if ($data['save'] == 'Submit') {
                $show = 1;
                $approved = 2;
            }
            $work_insert_query = "INSERT INTO " . self::TAB_WORK . "(" . self::TAB_WORK_USER_ID . ", " . self::TAB_WORK_TITLE . ", " . self::TAB_WORK_DESCRIPTION . ", " . self::TAB_WORK_CREATED_BY . ", " . self::TAB_WORK_REQUEST_FOR . ", " . self::TAB_WORK_CREATED_DATE . ", " . self::TAB_WORK_MODIFIED_DATE . ", " . self::TAB_WORK_WORK_DATE . ")
                                                                VALUES(:user_id,:work_title,:work_description,:created_by,:request_for,:created_date,:modified_date,:work_date)";
            $work_insert = $dbh->prepare($work_insert_query);
            $work_insert->execute(array(':user_id' => $data['team_member'],
                ':work_title' => $data['work_title'],
                ':work_description' => $data['work_desc'],
                ':created_by' => $data['user_id'],
                ':request_for' => $data['rating'],
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':work_date' => $workdate));

            $work_last_insert = $dbh->lastInsertId();
            $request_insert_query = "INSERT INTO " . self::TAB_REQUEST . "(" . self::TAB_REQUEST_FROM_ID . ", " . self::TAB_REQUEST_TO_ID . ", " . self::TAB_REQUEST_STATUS . ", " . self::TAB_REQUEST_WORK_ID . ", " . self::TAB_REQUEST_CREATED_DATE . ", " . self::TAB_REQUEST_MODIFIED_DATE . ", " . self::TAB_REQUEST_SHOW . ")
                                                                         VALUES(:from_id,:to_id,:status,:work_id,:created_date,:modified_date,:show_request)";
            $request_insert = $dbh->prepare($request_insert_query);
            $request_insert->execute(array(':from_id' => $data['user_id'],
                ':to_id' => $data['team_member'],
                ':status' => $approved,
                ':work_id' => $work_last_insert,
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':show_request' => $show));

            $request_last_insert = $dbh->lastInsertId();
            $rating_insert_query = "INSERT INTO " . self::TAB_RATING . "(" . self::TAB_RATING_REQUEST_ID . ", " . self::TAB_RATING_WORK_ID . ", " . self::TAB_RATING_USER_ID . ", " . self::TAB_RATING_RATING . ", " . self::TAB_RATING_GIVEN_BY . ", " . self::TAB_RATING_CREATED_DATE . ", " . self::TAB_RATING_MODIFIED_DATE . ", " . self::TAB_RATING_SHOW_RATING . ")
                                                                         VALUES(:request_id,:work_id,:user_id,:rating,:given_by,:created_date,:modified_date,:show_rating)";
            $rating_insert = $dbh->prepare($rating_insert_query);
            $rating_insert->execute(array(':request_id' => $request_last_insert,
                ':work_id' => $work_last_insert,
                ':user_id' => $data['team_member'],
                ':rating' => $data['rating'],
                ':given_by' => $login_user_id,
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':show_rating' => $show));

            if (isset($data['comment']) && !empty($data['comment'])) {

                $comment_insert_query = "INSERT INTO " . self::TAB_COMMENT . "(" . self::TAB_COMMENT_REQUEST_ID . ", " . self::TAB_COMMENT_TEXT . ", " . self::TAB_COMMENT_BY_ID . ", " . self::TAB_COMMENT_CREATED_DATE . ", " . self::TAB_COMMENT_MODIFIED_DATE . ")
                                                                         VALUES(:request_id,:comment_text,:by_id,:created_date,:modified_date)";
                $comment_insert = $dbh->prepare($comment_insert_query);
                $comment_insert->execute(array(':request_id' => $request_last_insert,
                    ':comment_text' => $data['comment'],
                    ':by_id' => $data['user_id'],
                    ':created_date' => $created_date,
                    ':modified_date' => $modified_date));
            }

            return true;
        }
    }

    function save_manager_work_rating($data) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $dateTime = new \DateTime();
            $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
            $pending = 0;
            $workdate = '';
            $workdate = ($data['work_date'] != '' || !empty($data['work_date'])) ? date('Y-m-d H:i:s', strtotime($data['work_date'])) : date('Y-m-d H:i:s');
            $work_insert_query = "INSERT INTO " . self::TAB_WORK . "(" . self::TAB_WORK_USER_ID . "," . self::TAB_WORK_FOR_ID . "," . self::TAB_WORK_TITLE . "," . self::TAB_WORK_DESCRIPTION . "," . self::TAB_WORK_CREATED_BY . "," . self::TAB_WORK_CREATED_DATE . "," . self::TAB_WORK_MODIFIED_DATE . "," . self::TAB_WORK_REQUEST_FOR . "," . self::TAB_WORK_WORK_DATE . ")
                                                                VALUES(:user_id,:for_id,:work_title,:work_description,:created_by,:created_date,:modified_date,:request_for,:work_date)";
            $work_insert = $dbh->prepare($work_insert_query);
            $work_insert->execute(array(':user_id' => $data['user_id'],
                ':for_id' => $data['for_id'],
                ':work_title' => $data['work_title'],
                ':work_description' => $data['work_desc'],
                ':created_by' => $data['user_id'],
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':request_for' => $data['rating'],
                ':work_date' => $workdate));
            $work_last_insert = $dbh->lastInsertId();

            if (isset($data['lead_id']) && !empty($data['lead_id']) && ($data['lead_id'] != -1)) {
                $request_insert_query = "INSERT INTO " . self::TAB_REQUEST . "(" . self::TAB_REQUEST_FROM_ID . "," . self::TAB_WORK_FOR_ID . "," . self::TAB_REQUEST_TO_ID . "," . self::TAB_REQUEST_STATUS . "," . self::TAB_REQUEST_WORK_ID . "," . self::TAB_REQUEST_CREATED_DATE . "," . self::TAB_REQUEST_MODIFIED_DATE . ")
                                                                          VALUES(:from_id,:for_id,:to_id,:status,:work_id,:created_date,:modified_date)";
                $request_insert = $dbh->prepare($request_insert_query);
                $request_insert->execute(array(':from_id' => $data['user_id'],
                    ':for_id' => $data['for_id'],
                    ':to_id' => $data['lead_id'],
                    ':status' => $pending,
                    ':work_id' => $work_last_insert,
                    ':created_date' => $created_date,
                    ':modified_date' => $modified_date));

                $request_last_insert = $dbh->lastInsertId();
                if (!empty($data)) {
                    notifyRequestToManager($data);
                }
            }
            return true;
        }
    }

    function get_manager_work_list($manager_id) {

        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT req.id,req.to_id as req_to_id,req.from_id as req_from_id,req.status,req.work_id,from_user.id as from_id,from_user.google_name as from_name,to_user.id as to_id,to_user.google_name as to_name,wk.title,wk.description FROM " . self::TAB_REQUEST . " as req
                                                          LEFT JOIN " . self::TAB_USER . " as from_user
                                                          ON
                                                          req." . self::TAB_REQUEST_FROM_ID . " = from_user." . self::COL_TAB_USER_ID . "
                                                          LEFT JOIN " . self::TAB_USER . " as to_user
                                                          ON
                                                          req." . self::TAB_REQUEST_TO_ID . " = to_user." . self::COL_TAB_USER_ID . "
                                                          LEFT JOIN " . self::TAB_WORK . " as wk
                                                          ON
                                                          req." . self::TAB_REQUEST_WORK_ID . " = wk." . self::TAB_WORK_ID . "
                                                          WHERE req." . self::TAB_REQUEST_TO_ID . " = :manager_id";
            $manager_work_list = $dbh->prepare($query);
            $manager_work_list->execute(array(':manager_id' => $manager_id));
            $row = $manager_work_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_rating($user_id) {
        $dbh = $this->get_connection();
        if ($dbh) {

            $query = "SELECT SUM(case when rating =1 then 1 else 0 end) as rating_plus,SUM(case when rating =0 then 1 else 0 end) as rating_minus FROM " . self::TAB_RATING . " WHERE " . self::TAB_RATING_USER_ID . " = :user_id AND " . self::TAB_RATING_SHOW_RATING . " =1";
            $rating = $dbh->prepare($query);
            $rating->execute(array(':user_id' => $user_id));
            $row = $rating->fetchAll((PDO::FETCH_ASSOC));
            return $row[0];
        }
    }

    function add_user($key, $value, $data, $id = '') {
        $dbh = $this->get_connection();
        if ($dbh) {

            if (isset($id) || $id != '') {

                $query = "SELECT * FROM " . self::TAB_USER . " WHERE id = :id";
                $user_list = $dbh->prepare($query);
                $user_list->execute(array(':id' => $id));
                $query_result = $user_list->fetchAll((PDO::FETCH_ASSOC));

                if (!empty($data)) {
                    $sql = "UPDATE users SET google_name ='" . $data['google_name'] . "', google_email ='" . $data['google_email'] . "', mobile_number ='" . $data['mobile_number'] . "', designation ='" . $data['designation'] . "', role_id ='" . $data['role_id'] . "', status ='" . $data['status'] . "' WHERE id='" . $id . "'";
                    $query = $dbh->prepare($sql);
                    $query_result = $query->execute();
                    return true;
                }
            } else {
                $query = "SELECT * FROM " . self::TAB_USER . " WHERE google_email = :email";
                $user_list = $dbh->prepare($query);
                $user_list->execute(array(':email' => $data['google_email']));
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                if (count($row) == 0) {

                    $query = "INSERT INTO " . self::TAB_USER . "($key) VALUES ($value)";
                    $add_user = $dbh->prepare($query);
                    $query_result = $add_user->execute();
                }
            }
            return $query_result;
        }
    }

    function get_request($id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (isset($id)) {
                $query = "SELECT * FROM " . self::TAB_REQUEST . " WHERE id = :id";
                $user_list = $dbh->prepare($query);
                $user_list->execute(array(':id' => $id));
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }

    function get_work_details($id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (isset($id)) {
                $query = "SELECT work.id,work.title,user.google_name,work.description,work.work_date,work.request_for, IFNULL(work.description,comment.comment_text)  as description FROM " . self::TAB_WORK . " as work LEFT JOIN " . self::TAB_REQUEST . " as request ON request.work_id = work.id LEFT JOIN " . self::TAB_COMMENT . " as comment ON request.id = comment.request_id  INNER JOIN " . self::TAB_USER . " as user ON user.id=work.user_id WHERE work.id = :id";
                die;
                $user_list = $dbh->prepare($query);
                $user_list->execute(array(':id' => $id));
                $row = $user_list->fetch((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }

    function save_emp_rating($data) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $dateTime = new \DateTime();
            $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
            if ($data['save'] == 'Save') {
                $show = 0;
                $status = 0;
            }
            if ($data['status']) {
                $show = 1;
                $status = 2;
            }
            $rating_inst = $this->get_rating_detail($data['request_id']);
            $comment_inst = $this->get_comment_detail($data['request_id']);
            $login_user_id = $_SESSION['userinfo']->id;

            if (empty($rating_inst)) {
                $rating_insert_query = "INSERT INTO " . self::TAB_RATING . "(" . self::TAB_RATING_REQUEST_ID . ", " . self::TAB_RATING_WORK_ID . ", " . self::TAB_RATING_USER_ID . ", " . self::TAB_RATING_RATING . ", " . self::TAB_RATING_GIVEN_BY . ", " . self::TAB_RATING_CREATED_DATE . ", " . self::TAB_RATING_MODIFIED_DATE . ", " . self::TAB_RATING_SHOW_RATING . ")
                                                                         VALUES(:request_id,:work_id,:user_id,:rating,:given_by,:created_date,:modified_date,:show_rating)";
                $rating_insert = $dbh->prepare($rating_insert_query);
                $rating_insert->execute(array(':request_id' => $data['request_id'],
                    ':work_id' => $data['work_id'],
                    ':user_id' => $data['team_member'],
                    ':rating' => $data['rating'],
                    ':given_by' => $login_user_id,
                    ':created_date' => $created_date,
                    ':modified_date' => date("Y-m-d H:i:s", time() + 1),
                    ':show_rating' => $show));
            } else {
                $rate = $data['rating'];
                $sql = "Update " . self::TAB_RATING . " SET " . self::TAB_RATING_SHOW_RATING . " ='" . $show . "',rating = $rate,modified_date = '" . date("Y-m-d H:i:s") . "' WHERE request_id = '" . $data['request_id'] . "'";
                $query = $dbh->prepare($sql);
                $data2 = $query->execute();
            }
            if (empty($comment_inst)) {
                $comment_insert_query = "INSERT INTO " . self::TAB_COMMENT . "(" . self::TAB_COMMENT_REQUEST_ID . ", " . self::TAB_COMMENT_TEXT . ", " . self::TAB_COMMENT_BY_ID . ", " . self::TAB_COMMENT_CREATED_DATE . ", " . self::TAB_COMMENT_MODIFIED_DATE . ")
                                                                             VALUES(:request_id,:comment_text,:by_id,:created_date,:modified_date)";
                $comment_insert = $dbh->prepare($comment_insert_query);
                $comment_insert->execute(array(':request_id' => $data['request_id'],
                    ':comment_text' => $data['comment'],
                    ':by_id' => $data['user_id'],
                    ':created_date' => $created_date,
                    ':modified_date' => $modified_date));
            } else {
                $update_comment = "Update " . self::TAB_COMMENT . " SET " . self::TAB_COMMENT_TEXT . " ='" . $data['comment'] . "',modified_date = '" . date('Y-m-d H:m:s') . "' WHERE request_id = '" . $data['request_id'] . "'";
                $query_comment = $dbh->prepare($update_comment);
                $comment_update_data = $query_comment->execute();
            }
            $sql = "Update " . self::TAB_WORK . " SET " . self::TAB_WORK_DESCRIPTION . "='" . $data['comment'] . "' WHERE id = '" . $data['work_id'] . "'";
            $query = $dbh->prepare($sql);
            $data2 = $query->execute();
            notifyRequestStatus($data, "approve");
            $sql = "Update " . self::TAB_REQUEST . " SET show_request ='" . $show . "',status = '" . $status . "', modified_date = '" . $modified_date . "' WHERE id = '" . $data['request_id'] . "'";
            $query = $dbh->prepare($sql);
            $data2 = $query->execute();
            return true;
        }
    }

    function edit_comment($data) {
    
        $dbh = $this->get_connection();
        if ($dbh) {
	    if(empty($data['pk'])){
	      $data['pk'] = $data['rating_id'] ;
	      $data['value'] = $data['desc'];
	    }
	    $rating_record = $this->get_rating_detail($data['pk'], true);

	    $sql = "Update " . self::TAB_WORK . " SET  "
                    . "description = '" . $data['value'] . "', "
                    . "modified_date = '" . date('Y-m-d H:m:s') . "'"
                    . " WHERE id = '" . $rating_record['work_id'] . "'";
             
            $query = $dbh->prepare($sql);
            $comment_data = $query->execute();

            return $comment_data;
        }
    }

    function get_comment_detail($request_id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT * FROM " . self::TAB_COMMENT . " WHERE " . self::TAB_COMMENT_REQUEST_ID . " = :request_id";
            $status = $dbh->prepare($query);
            $status->execute(array(':request_id' => $request_id));
            $row = $status->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_request_detail($request_id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT req.id,req.to_id as req_to_id,req.from_id as req_from_id,req.status,req.work_id,rt.rating, wk.request_for, rt.request_id,from_user.id as from_id,from_user.google_name as from_name,to_user.id as to_id,to_user.google_name as to_name,wk.title,wk.description FROM " . self::TAB_REQUEST . " as req
                                                          LEFT JOIN " . self::TAB_USER . " as from_user
                                                          ON
                                                          req." . self::TAB_REQUEST_FROM_ID . " = from_user." . self::COL_TAB_USER_ID . "

                                                          LEFT JOIN " . self::TAB_USER . " as to_user
                                                          ON
                                                          req." . self::TAB_REQUEST_TO_ID . " = to_user." . self::COL_TAB_USER_ID . "
                                                          LEFT JOIN " . self::TAB_WORK . " as wk
                                                          ON
                                                          req." . self::TAB_REQUEST_WORK_ID . " = wk." . self::TAB_WORK_ID . "
                                                          LEFT JOIN " . self::TAB_RATING . " as rt
                                                          ON
                                                          req." . self::TAB_REQUEST_WORK_ID . " = rt." . self::TAB_RATING_REQUEST_ID . "
                                                          WHERE req." . self::TAB_REQUEST_ID . " = :request_id";
            $request_detail = $dbh->prepare($query);
            $request_detail->execute(array(':request_id' => $request_id));
            $row = $request_detail->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function pagination($function_name, $page_number, $id_parameter = null) {
        $per_page = 10;         // number of results to show per page
        if (isset($id_parameter) && ($id_parameter != null)) {
            $total_results = $this->$function_name($id_parameter);
        } else {
            $total_results = $this->$function_name();
        }
        $total_pages = ceil($total_results / $per_page); //total pages we going to have

        if ($page_number != 0) {

            $show_page = $page_number;             //it will telles the current page
            if ($show_page > 0 && $show_page <= $total_pages) {
                $start = ($show_page - 1) * $per_page;
                //$end = $start + $per_page;
                $end = $per_page;
            } else {
                // error - show first set of results
                $start = 0;
                $end = $per_page;
            }
        } else {
            // if page isn't set, show first set of results
            $start = 0;
            $end = $per_page;
        }
        if (isset($id_parameter) && ($id_parameter != null)) {
            $total_result = $this->$function_name($id_parameter, $start, $end);
        } else {
            $total_result = $this->$function_name(null, $start, $end);
        }
        return array($total_result, $total_pages, $total_results, $per_page);
    }

    function get_user_list_pagination($string = null, $start = null, $end = null) {

        $dbh = $this->get_connection();
        if ($dbh) {
            $cnd = '';
            if ($string != '') {
                $cnd = " WHERE google_name LIKE  '%" . $string . "%' OR google_email LIKE '%" . $string . "%' ";
            }
            if (isset($start) && isset($end)) {
                //$query = "SELECT * FROM ".self::TAB_USER." WHERE ".self::COL_TAB_USER_ID." = :id";
                //$query = "SELECT * FROM ".self::TAB_USER." WHERE id != :id LIMIT :start, :end";
                $query = "SELECT * FROM " . self::TAB_USER . $cnd . " ORDER BY id desc LIMIT " . $start . "," . $end;
                $user_list = $dbh->prepare($query);
                $user_list->execute();
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            } else {
                $query = "SELECT * FROM " . self::TAB_USER . " " . $cnd . " ORDER BY id desc";
                $user_list = $dbh->prepare($query);
                $user_list->execute();
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return count($row);
            }
            /*   else {
              //$query = "SELECT * FROM ".self::TAB_USER." WHERE ".self::COL_TAB_USER_ID." = :id";
              $query = "SELECT * FROM ".self::TAB_USER;
              $user_list = $dbh->prepare($query);
              $user_list->execute();
              $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
              //echo "<pre>";print_r($row);die("stop");
              return $row;
             * .

              } */
        }
    }

    function get_manager_work_list_paginate($manager_id = null, $start = null, $end = null) {

        $dbh = $this->get_connection();
        if ($dbh) {
            $cnd = '';
            $tm_arr = $this->get_all_member($manager_id);
            if (is_array($tm_arr)) {
                foreach ($tm_arr as $tm_details) {
                    $tm_list .= $tm_details['user_id'] . ",";
                }
                $tm_list = substr($tm_list, 0, -1);
                $cnd = " AND req." . self::TAB_REQUEST_FROM_ID . " IN (" . $tm_list . ")  ";
            }
            if (isset($start) && isset($end)) {
                $query = "SELECT req.id,req.to_id as req_to_id, wk.request_for as rating, req.created_date as req_date, req.read_status,req.from_id as req_from_id,req.status,req.work_id,from_user.id as from_id,from_user.google_name as from_name,to_user.id as to_id,to_user.google_name as to_name,wk.title,wk.description,wk.work_date FROM " . self::TAB_REQUEST . " as req
                                                          LEFT JOIN " . self::TAB_USER . " as from_user
                                                          ON
                                                          req." . self::TAB_REQUEST_FROM_ID . " = from_user." . self::COL_TAB_USER_ID . "
                                                          LEFT JOIN " . self::TAB_USER . " as to_user
                                                          ON
                                                          req." . self::TAB_REQUEST_TO_ID . " = to_user." . self::COL_TAB_USER_ID . "
                                                          LEFT JOIN " . self::TAB_WORK . " as wk
                                                          ON
                                                          req." . self::TAB_REQUEST_WORK_ID . " = wk." . self::TAB_WORK_ID . "
                                                          WHERE req." . self::TAB_REQUEST_TO_ID . " = :manager_id " . $cnd . " ORDER BY id desc " . " LIMIT " . $start . "," . $end;
                $manager_work_list = $dbh->prepare($query);
                $manager_work_list->execute(array(':manager_id' => $manager_id));
                $row = $manager_work_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            } else {
                $query = "SELECT req.id,req.to_id as req_to_id,req.from_id as req_from_id,req.status,req.work_id,from_user.id as from_id,from_user.google_name as from_name,to_user.id as to_id,to_user.google_name as to_name,wk.title,wk.description FROM " . self::TAB_REQUEST . " as req
                                                          LEFT JOIN " . self::TAB_USER . " as from_user
                                                          ON
                                                          req." . self::TAB_REQUEST_FROM_ID . " = from_user." . self::COL_TAB_USER_ID . "
                                                          LEFT JOIN " . self::TAB_USER . " as to_user
                                                          ON
                                                          req." . self::TAB_REQUEST_TO_ID . " = to_user." . self::COL_TAB_USER_ID . "
                                                          LEFT JOIN " . self::TAB_WORK . " as wk
                                                          ON
                                                          req." . self::TAB_REQUEST_WORK_ID . " = wk." . self::TAB_WORK_ID . "
                                                          WHERE req." . self::TAB_REQUEST_TO_ID . " = :manager_id ORDER BY id desc";
                $manager_work_list = $dbh->prepare($query);
                $manager_work_list->execute(array(':manager_id' => $manager_id));
                $row = $manager_work_list->fetchAll((PDO::FETCH_ASSOC));
                return count($row);
            }
        }
    }

    function unread_request($request_id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {

            $query = "UPDATE " . self::TAB_REQUEST . " SET read_status = '1' WHERE id = :id";
            $update_status = $dbh->prepare($query);
            $update_status = $update_status->execute(array(':id' => $request_id));
            return $update_status;
        }
    }

    function get_unread_count() {
        $dbh = $this->get_connection();
        if ($dbh) {
            $cnd = '';
            $tm_arr = $this->get_all_member($_SESSION['userinfo']->id);
            if (is_array($tm_arr)) {
                foreach ($tm_arr as $tm_details) {
                    $tm_list = $tm_details['user_id'] . ",";
                }
                $tm_list = substr($tm_list, 0, -1);
                $cnd = " AND " . self::TAB_REQUEST_FROM_ID . " IN (" . $tm_list . ")  ";
            }
            $query = "SELECT COUNT(read_status) as unread FROM " . self::TAB_REQUEST . " WHERE " . self::TAB_REQUEST_TO_ID . " = :user_id " . $cnd . " AND " . self::TAB_REQUEST_READ_STATUS . " = 0"; #echo "--".$_SESSION['userinfo']->id; die;
            $status = $dbh->prepare($query);
            $status->execute(array(':user_id' => $_SESSION['userinfo']->id));
            $row = $status->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function clear_unread_count() {
        $dbh = $this->get_connection();
        if ($dbh) {

            $query = "UPDATE " . self::TAB_REQUEST . " SET read_status = '1' WHERE " . self::TAB_REQUEST_TO_ID . " = :user_id AND " . self::TAB_REQUEST_READ_STATUS . " = 0";
            $status = $dbh->prepare($query);
            $status->execute(array(':user_id' => $_SESSION['userinfo']->id));
            return $row;
        }
    }

    function admin_login($email, $password) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (!empty($email) && !empty($password)) {
                if (($email == self::ADMIN_LOGIN_EMAILID) && ($password == self::ADMIN_LOGIN_PASSWORD)) {
                    $query = "SELECT * FROM " . self::TAB_USER . " WHERE " . self::COL_TAB_USER_ROLE_ID . " = :role_id";
                    $status = $dbh->prepare($query);
                    $status->execute(array(':role_id' => 8));
                    $row = $status->fetch((PDO::FETCH_OBJ));
                    $_SESSION['userinfo'] = $row;
                    return $row;
                }
            } else {

                return $row;
            }
        }
    }

    function check_email($email = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $user_id = $_SESSION['userinfo']->id;
            $query = "SELECT count(id) as id FROM " . self::TAB_USER . " WHERE " . self::COL_TAB_USER_ID . " != :user_id and " . self::COL_TAB_USER_EMAIL . " = :email";
            $status = $dbh->prepare($query);
            $status->execute(array(':user_id' => $user_id, ':email' => $email));
            $row = $status->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_rating_detail($request_id, $pk = false) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if ($pk === true) {
                $query = "SELECT * FROM " . self::TAB_RATING . " WHERE " . self::TAB_RATING_ID . " = :request_id";
                $status = $dbh->prepare($query);
                $status->execute(array(':request_id' => $request_id));
            } else {
                $query = "SELECT * FROM " . self::TAB_RATING . " WHERE " . self::TAB_RATING_REQUEST_ID . " = :request_id";
                $status = $dbh->prepare($query);
                $status->execute(array(':request_id' => $request_id));
            }

            $row = $status->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function view_all_send_request($work_id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            //$query = "SELECT * FROM ".self::TAB_REQUEST." WHERE ".self::TAB_REQUEST_WORK_ID." = :work_id";
            $query = "SELECT req.id,req.to_id as req_to_id,req.from_id as req_from_id,req.created_date,req.status,req.work_id,rt.rating,from_user.id as from_id,from_user.google_name as from_name,to_user.id as to_id,to_user.google_name as to_name,wk.title,wk.description,wk.work_date,wk.request_for FROM " . self::TAB_REQUEST . " as req
                                                          INNER JOIN " . self::TAB_USER . " as from_user
                                                          ON
                                                          req." . self::TAB_REQUEST_FROM_ID . " = from_user." . self::COL_TAB_USER_ID . "
                                                          INNER JOIN " . self::TAB_USER . " as to_user
                                                          ON
                                                          req." . self::TAB_REQUEST_TO_ID . " = to_user." . self::COL_TAB_USER_ID . "
                                                          INNER JOIN " . self::TAB_WORK . " as wk
                                                          ON
                                                          req." . self::TAB_REQUEST_WORK_ID . " = wk." . self::TAB_WORK_ID . "
                                                          LEFT JOIN " . self::TAB_RATING . " as rt
                                                          ON
                                                          req." . self::TAB_REQUEST_WORK_ID . " = rt." . self::TAB_RATING_WORK_ID . "
                                                          WHERE req." . self::TAB_REQUEST_WORK_ID . " = :work_id ORDER BY id desc";
            $status = $dbh->prepare($query);
            $status->execute(array(':work_id' => $work_id));
            $row = $status->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function rating_dashboard($all_data, $match_char = '') {

        $unique_array = array();
        $dbh = $this->get_connection();
        if ($dbh) {
            $cnd = '';
            $tms = '';
            $currentDate = date('Y-m-d');
            $finalDate = date('Y-m-d', strtotime("-90 days",strtotime($currentDate)));
                        
            if (is_array($all_data) && !empty($all_data)) {
                foreach ($all_data as $key => $value)
                    $tms .= $value['user_id'] . ",";
                $tms = substr($tms, 0, -1);
                $cnd .= " AND  a.id in (" . $tms . ") ";
                if ($match_char != ''){
                    if($match_char != 'Click here' && $match_char != 'Show'){
		      $cnd .= " AND  a.google_name like '" . $match_char . "%' ";
                    }
		}
                $query = "SELECT a.*,uh.manager_id FROM users a JOIN " . self::TAB_USER_HIERARCHY . " uh ON uh." . self::TAB_USER_HIERARCHY_id . " = a." . self::COL_TAB_USER_ID . " WHERE 1  " . $cnd;
                $status = $dbh->prepare($query);
                $status->execute();
                $row = $status->fetchAll((PDO::FETCH_ASSOC));

                $selected_tms = '';
                if (!empty($row)) {
                    $selected_tms = '';

                    foreach ($row as $users) {
                        $selected_tms .= $users['id'] . ",";
                        $unique_array[$users['id']] = $users;
                    }
                    $selected_tms = substr($selected_tms, 0, -1);
                    
                    if($match_char == 'Click here'){
                    $query = "select rating.user_id,SUM(case when rating.rating =1 then 1 else 0 end) as rating_plus,
                                                        SUM(case when rating.rating =0 then 1 else 0 end) as rating_minus,
                                                        SUM(case when rating.rating =2 then 1 else 0 end) as rating_none
                                                        from rating as rating where rating.user_id in (" . $selected_tms . ") group by rating.user_id ";
                    }else{
                    $query = "select rating.user_id,SUM(case when rating.rating =1 then 1 else 0 end) as rating_plus,
                                                        SUM(case when rating.rating =0 then 1 else 0 end) as rating_minus,
                                                        SUM(case when rating.rating =2 then 1 else 0 end) as rating_none
                                                        from rating as rating where rating.modified_date >= '".$finalDate."' AND rating.user_id in (" . $selected_tms . ") group by rating.user_id ";
                    }                                    
                    $rating = $dbh->prepare($query);
                    $rating->execute();
                    $rating_result = $rating->fetchAll((PDO::FETCH_ASSOC));
                    foreach ($rating_result as $ratings) {
                        $unique_array[$ratings['user_id']]['rating_plus'] = $ratings['rating_plus'];
                        $unique_array[$ratings['user_id']]['rating_minus'] = $ratings['rating_minus'];
                        $unique_array[$ratings['user_id']]['rating_none'] = $ratings['rating_none'];
                    }
                }
            }

            return $unique_array;
        }
    }

    function get_review_outbox($user_id = null) {

        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT work.id,work.created_date,work.title,user.id as for_id,user.google_name,work.description,rating.id as rating_id,rating.rating as rating FROM " . self::TAB_WORK . " as work INNER JOIN "
                    . self::TAB_USER . " as user ON user.id=work.user_id LEFT JOIN " . self::TAB_RATING . " as rating ON rating.work_id=work.id WHERE work.created_by= :id AND work.user_id != :user_id ORDER BY work.id desc ";

            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':id' => $user_id,
                ':user_id' => $user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function check_session() {
        $id = $_SESSION['userinfo']->id;
        if ($id == '') {
            return 0;
        } else {
            return 1;
        }
    }

    function get_work_count($id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT * FROM " . self::TAB_WORK . " WHERE user_id = :id";
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':id' => $id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            $num_rows = count($row);
            return $num_rows;
        }
    }

    function get_work_list_pagination($id = null, $start, $limit) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (isset($id)) {
                $query = "SELECT work.id,work.title,work.work_date,user.id as for_id,user.google_name,work.description,cby.id as created_by_id,cby.google_name as created_by_name FROM " . self::TAB_WORK . " as work INNER JOIN " . self::TAB_REQUEST . " as request ON work.id = request.work_id INNER JOIN "
                        . self::TAB_USER . " as user ON user.id=work.user_id LEFT JOIN " . self::TAB_USER . " as cby ON cby.id=work.created_by WHERE work.user_id = :id and (request.status = '2' or request.from_id = '" . $_SESSION['userinfo']->id . "' ) ORDER BY work.id desc LIMIT " . $start . "," . $limit;
                $user_list = $dbh->prepare($query);
                $user_list->execute(array(':id' => $id));
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            } else {
                $query = "SELECT * FROM " . self::TAB_WORK;
                $user_list = $dbh->prepare($query);
                $user_list->execute();
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }

    function get_request_status($id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (!empty($id)) {
                $query = "SELECT * FROM " . self::TAB_REQUEST . " WHERE " . self::COL_TAB_REQUEST_WORK_ID . " = :id ORDER BY " . self::TAB_REQUEST_ID . " DESC";

                $profile_data = $dbh->prepare($query);
                $profile_data->execute(array(':id' => $id));
                $row = $profile_data->fetch((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }

    function edit_work($id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (!empty($id)) {
                $query = "SELECT * FROM " . self::TAB_WORK . " WHERE " . self::COL_TAB_WORK_ID . " = :id";
                $profile_data = $dbh->prepare($query);
                $profile_data->execute(array(':id' => $id));
                $row = $profile_data->fetch((PDO::FETCH_ASSOC));
                if (isset($row) && !empty($row)) {
                    return $row;
                } else {
                    return 0;
                }
            }
        }
    }

    function update_work($data) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $sql = "Update " . self::TAB_WORK . " SET title = '" . $data['work_title'] . "', description = '" . $data['work_desc'] . "', modified_date = '" . date('Y-m-d H:m:s') . "' WHERE id = '" . $data['id'] . "'";
            $query = $dbh->prepare($sql);
            $data2 = $query->execute();

            if ($data['request_to'] != '-1') {
                $sql1 = "INSERT INTO " . self::TAB_REQUEST . " (from_id,to_id,status,work_id,created_date,modified_date) VALUES ('" . $data['user_id'] . "','" . $data['request_to'] . "','0','" . $data['id'] . "','" . date('Y-m-d H:m:s') . "','" . date('Y-m-d H:m:s') . "')";
                $query1 = $dbh->prepare($sql1);
                $data1 = $query1->execute();
            }
            return $data2;
        }
    }

    function send_request($data) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $sql1 = "INSERT INTO " . self::TAB_REQUEST . " (from_id,to_id,status,work_id,created_date,modified_date) VALUES ('" . $data['user_id'] . "','" . $data['request_to'] . "','0','" . $data['work_id'] . "','" . date('Y-m-d H:m:s') . "','" . date('Y-m-d H:m:s') . "')";
            $query1 = $dbh->prepare($sql1);
            $data1 = $query1->execute();
            return $data1;
        }
    }

    function get_request_details($id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (isset($id)) {
                //$query = "SELECT * FROM ".self::TAB_USER." WHERE ".self::COL_TAB_USER_ID." = :id";
                $query = "SELECT * FROM " . self::TAB_REQUEST . " WHERE work_id = :id";
                $user_list = $dbh->prepare($query);
                $user_list->execute(array(':id' => $id));
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }

    function decline($data) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $dateTime = new \DateTime();
            $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
            $id = $data['request_id'];
            $sql = "Update " . self::TAB_REQUEST . " SET show_request='1',status = '1', modified_date = '" . $modified_date . "' WHERE id = '" . $id . "'";
            $query = $dbh->prepare($sql);
            $data2 = $query->execute();
            $this->unread_request($id);
            $comment_insert_query = "INSERT INTO " . self::TAB_COMMENT . "(" . self::TAB_COMMENT_REQUEST_ID . ", " . self::TAB_COMMENT_TEXT . ", " . self::TAB_COMMENT_BY_ID . ", " . self::TAB_COMMENT_CREATED_DATE . ", " . self::TAB_COMMENT_MODIFIED_DATE . ")
                                                                             VALUES(:request_id,:comment_text,:by_id,:created_date,:modified_date)";
            $comment_insert = $dbh->prepare($comment_insert_query);

            $comment_insert->execute(array(':request_id' => $id,
                ':comment_text' => $data['comment'],
                ':by_id' => $data['user_id'],
                ':created_date' => $created_date,
                ':modified_date' => $modified_date));
            notifyRequestStatus($data, "decline");
            return true;
        }
    }

    function get_work_count_manager($id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT * FROM " . self::TAB_WORK . " WHERE created_by = :id AND user_id != :id";
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':id' => $id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            $num_rows = count($row);
            return $num_rows;
        }
    }

    function get_work_list_pagination_manager($id = null, $start, $limit) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (isset($id)) {
                $query = "SELECT cbys.id as request_id,work.id,work.title,work.work_date,user.id as for_id,user.google_name,work.description,cby.id as created_by_id,cby.google_name as created_by_name FROM " . self::TAB_WORK . " as work INNER JOIN "
                        . self::TAB_USER . " as user ON user.id=work.user_id  LEFT JOIN " . self::TAB_REQUEST . " as cbys ON cbys.work_id=work.id LEFT JOIN " . self::TAB_USER . " as cby ON cby.id=work.created_by WHERE work.user_id != :id AND work.created_by = :id ORDER BY work.id desc LIMIT " . $start . "," . $limit;
                $user_list = $dbh->prepare($query);
                $user_list->execute(array(':id' => $id));
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            } else {
                $query = "SELECT * FROM " . self::TAB_WORK;
                $user_list = $dbh->prepare($query);
                $user_list->execute();
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }

    function get_role_name($role_id = null) {

        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT name FROM " . self::TAB_ROLE_TYPE . " WHERE " . self::TAB_ROLE_TYPE_ID . " = :role_id";
            $status = $dbh->prepare($query);
            $status->execute(array(':role_id' => $role_id));
            $row = $status->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_user_full_name($user_id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT google_name FROM " . self::TAB_USER . " WHERE " . self::COL_TAB_USER_ID . " = :id";
            $status = $dbh->prepare($query);
            $status->execute(array(':id' => $user_id));
            $row = $status->fetch((PDO::FETCH_ASSOC));
            return (!empty($row['google_name'])) ? $row['google_name'] : "Name Not Set.";
        }
    }

    function get_user_email($user_id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT google_email FROM " . self::TAB_USER . " WHERE " . self::COL_TAB_USER_ID . " = :id";
            $status = $dbh->prepare($query);
            $status->execute(array(':id' => $user_id));
            $row = $status->fetch((PDO::FETCH_ASSOC));
            return (!empty($row['google_email'])) ? $row['google_email'] : "Email Not Set.";
        }
    }

    function update_status($data) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $status = $data['status'];
            $id = $data['id'];
            $sql = "Update " . self::TAB_USER . " SET " . self::COL_TAB_USER_STATUS . "= $status WHERE id = '" . $id . "'";
            $query = $dbh->prepare($sql);
            $data2 = $query->execute();
            $this->unread_request($id);
            return true;
        }
    }

    function saveWorkManager($data) {
        $data['work_title'] = "System generated";
        $data['work_desc'] = $data['desc'];
        $dbh = $this->get_connection();
        if ($dbh) {
            $dateTime = new \DateTime();
            $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
            $login_user_id = $_SESSION['userinfo']->id;

            $workdate = '';
            if ($data['work_date'] != '' || !empty($data['work_date']))
                $workdate = date('Y-m-d H:i:s', strtotime($data['work_date']));
            $show = 1;
            $approved = 2;
            $work_insert_query = "INSERT INTO " . self::TAB_WORK . "(" . self::TAB_WORK_USER_ID . ", " . self::TAB_WORK_TITLE . ", " . self::TAB_WORK_DESCRIPTION . ", " . self::TAB_WORK_CREATED_BY . ", " . self::TAB_WORK_REQUEST_FOR . ", " . self::TAB_WORK_CREATED_DATE . ", " . self::TAB_WORK_MODIFIED_DATE . ", " . self::TAB_WORK_WORK_DATE . ")
                                                                VALUES(:user_id,:work_title,:work_description,:created_by,:request_for,:created_date,:modified_date,:work_date)";
            $work_insert = $dbh->prepare($work_insert_query);
            $work_insert->execute(array(':user_id' => $data['user_id'],
                ':work_title' => $data['work_title'],
                ':work_description' => $data['work_desc'],
                ':created_by' => $login_user_id,
                ':request_for' => $data['rating'],
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':work_date' => $workdate));

            $work_last_insert = $dbh->lastInsertId();
            $request_insert_query = "INSERT INTO " . self::TAB_REQUEST . "(" . self::TAB_REQUEST_FROM_ID . ", " . self::TAB_REQUEST_TO_ID . ", " . self::TAB_REQUEST_STATUS . ", " . self::TAB_REQUEST_WORK_ID . ", " . self::TAB_REQUEST_CREATED_DATE . ", " . self::TAB_REQUEST_MODIFIED_DATE . ", " . self::TAB_REQUEST_SHOW . ")
                                                                         VALUES(:from_id,:to_id,:status,:work_id,:created_date,:modified_date,:show_request)";
            $request_insert = $dbh->prepare($request_insert_query);
            $request_insert->execute(array(':from_id' => $login_user_id,
                ':to_id' => $data['user_id'],
                ':status' => $approved,
                ':work_id' => $work_last_insert,
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':show_request' => $show));

            $request_last_insert = $dbh->lastInsertId();
            $rating_insert_query = "INSERT INTO " . self::TAB_RATING . "(" . self::TAB_RATING_REQUEST_ID . ", " . self::TAB_RATING_WORK_ID . ", " . self::TAB_RATING_USER_ID . ", " . self::TAB_RATING_RATING . ", " . self::TAB_RATING_GIVEN_BY . ", " . self::TAB_RATING_CREATED_DATE . ", " . self::TAB_RATING_MODIFIED_DATE . ", " . self::TAB_RATING_SHOW_RATING . ")
                                                                         VALUES(:request_id,:work_id,:user_id,:rating,:given_by,:created_date,:modified_date,:show_rating)";
            $rating_insert = $dbh->prepare($rating_insert_query);
            $rating_insert->execute(array(':request_id' => $request_last_insert,
                ':work_id' => $work_last_insert,
                ':user_id' => $data['user_id'],
                ':rating' => $data['rating'],
                ':given_by' => $login_user_id,
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':show_rating' => $show));

            if (isset($data['comment']) && !empty($data['comment'])) {

                $comment_insert_query = "INSERT INTO " . self::TAB_COMMENT . "(" . self::TAB_COMMENT_REQUEST_ID . ", " . self::TAB_COMMENT_TEXT . ", " . self::TAB_COMMENT_BY_ID . ", " . self::TAB_COMMENT_CREATED_DATE . ", " . self::TAB_COMMENT_MODIFIED_DATE . ")
                                                                         VALUES(:request_id,:comment_text,:by_id,:created_date,:modified_date)";
                $comment_insert = $dbh->prepare($comment_insert_query);
                $comment_insert->execute(array(':request_id' => $request_last_insert,
                    ':comment_text' => $data['comment'],
                    ':by_id' => $login_user_id,
                    ':created_date' => $created_date,
                    ':modified_date' => $modified_date));
            }
            if (isset($data['action']) && ($data['action'] == 'btn_click'))
                notifyAwardOne($data);
            return true;
        }
    }

    function get_user_characters($team_members = array()) {
        $row = array();
        $dbh = $this->get_connection();
        if ($dbh) {
            $cnd = '';
            $tms = '';
            if (is_array($team_members) && !empty($team_members)) {

                foreach ($team_members as $key => $value) {
                    $tms .= $value['user_id'] . ",";
                }
                $tms = substr($tms, 0, -1);
                $cnd .= " AND  a.id in (" . $tms . ") ";
                $query = "select substr(google_name,1,1) as name from users as a where google_name != '' " . $cnd . " group by substr(google_name,1,1) ";
                $status = $dbh->prepare($query);
                $status->execute();
                $row = $status->fetchAll((PDO::FETCH_ASSOC));
            }
        }
        return $row;
    }

    function get_work_rating($user_id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT work.work_date,work.title,if( comment.comment_text != '', comment.comment_text, work.description ) AS description,work.created_by as given_by,user.google_name as given_by_name,rating.user_id,rating.rating as rating,rating.id as rate_id,rating.created_date, comment.comment_text AS manager_comment"
                    . " FROM " . self::TAB_RATING . " AS rating  LEFT JOIN " . self::TAB_WORK . " AS work  ON rating.work_id = work.id
                                                    LEFT JOIN " . self::TAB_USER . " AS user ON user.id = rating.given_by
                                                    LEFT JOIN " . self::TAB_COMMENT . " AS comment ON comment.request_id = rating.request_id
                                                    WHERE rating.user_id= :user_id  ORDER BY rating.created_date desc ";
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':user_id' => $user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_user_request_details($user_id = null, $status = '') {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (isset($user_id)) {
                $cnd = '';
                if ($status != '')
                    $cnd = " AND request.status = " . $status;
                $query = "select user.google_name,user.id as lead_id, user.google_picture_link, role.name as role_name, request.to_id,request.from_id,description,work.created_date,request_for,rating, request.status from work as work left join request as request on work.id = request.work_id left join rating as rating on work.id=rating.work_id left join  users as user on request.to_id=user.id left join role_type as role on role.id = user.role_id where work.created_by = " . $user_id . $cnd . " order by work.id desc";
                $user_list = $dbh->prepare($query);
                $user_list->execute();
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }

    function get_team_member_requests($user_id = null) {
        $dbh = $this->get_connection();
        if ($dbh) {
            if (isset($user_id)) {
                $query = "SELECT user.google_name,user.google_picture_link, request.id as request_id, request.to_id,request.from_id, request.for_id, description, work.created_date, request_for, work.id AS work_id "
                        . "FROM work AS work LEFT JOIN request AS request ON work.id = request.work_id "
                        . "LEFT JOIN  users AS user ON IF( work.user_id = work.for_id, request.from_id = user.id, request.for_id = user.id ) WHERE request.to_id = " . $user_id . " AND request.status = 0 "
                        . "ORDER BY work.id DESC";
                $user_list = $dbh->prepare($query);
                $user_list->execute();
                $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
                return $row;
            }
        }
    }

    function get_all_group_team_members($login_user_id) {
        $dbh = $this->get_connection();
        if ($dbh) {

            $member_ids = $this->get_my_team_mem($login_user_id);
            $member_ids = rtrim($member_ids, ',');

            $condition = '';
            if (!empty($member_ids)) {
                $condition = "id NOT IN ($member_ids)  AND";
            }

            $query = "SELECT `id`,`google_name`,`designation`,`google_picture_link` FROM " . self::TAB_USER . " WHERE $condition id <>:id AND id <> 1 AND status <> 0 ORDER BY google_name";
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':id' => $login_user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_my_recent_activity($login_user_id) {
        $dbh = $this->get_connection();
        if ($dbh) {

            $query = "SELECT * FROM (SELECT r.user_id AS user_id,re.for_id,
                     re.status,r.given_by AS given_by,u.google_name AS ratedby,
                     u1.google_name AS rated_to,IF(r.rating = 1, '+1', '-1') AS rating,
                     u.google_picture_link,u1.google_picture_link AS for_picture,
                     r.modified_date AS created_date FROM " . self::TAB_RATING . " AS r
                     JOIN request re ON re.id = r.request_id JOIN " . self::TAB_USER . " AS u ON u.id = r.user_id
                     JOIN " . self::TAB_USER . " AS u1 ON u1.id = r.given_by
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
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':user_id' => $login_user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }
    
    function get_my_recent_activity_feedback($login_user_id) {
        $dbh = $this->get_connection();
        if ($dbh) {

            $query = "SELECT feedback.response_parent as response_parent,feedback.feedback_to as feedback_to,feedback.feedback_from as feedback_from,u1.id as user_id,u.google_name,u1.google_name AS ratedby,
                     u.google_picture_link,u1.google_picture_link AS for_picture,feedback.created_date AS created_date from feedback AS feedback
                     JOIN users AS u ON (u.id = feedback.feedback_to)
                     JOIN users AS u1 ON u1.id = feedback.feedback_from
                     WHERE feedback_from = :user_id
                     OR feedback.feedback_to = :user_id ORDER BY created_date DESC";
               
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':user_id' => $login_user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_all_members_by_alphabets($char, $login_user_id) {
        $dbh = $this->get_connection();
        $condition = '';

        if ($char == 'All') {
            $condition = '';
        } else {
            $condition = "AND google_name LIKE '$char%'";
        }
        if ($dbh) {

            $member_ids = $this->get_my_team_mem($login_user_id);
            $member_ids = rtrim($member_ids, ',');
            $noTeamMemberExist = '';
            if (!empty($member_ids)) {
                $noTeamMemberExist = "id NOT IN ($member_ids)  AND";
            }

            $query = "SELECT `id`,`google_name`,`designation`,`google_picture_link` FROM " . self::TAB_USER . " WHERE $noTeamMemberExist id <> :id AND id <> 1 AND status <> 0 $condition  ORDER BY google_name ";
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':id' => $login_user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_members_by_search_keyword($searchKeyword, $login_user_id) {
        $dbh = $this->get_connection();
        if ($dbh) {

            $member_ids = $this->get_my_team_mem($login_user_id);
            $member_ids = rtrim($member_ids, ',');
            $noTeamMemberExist = '';
            if (!empty($member_ids)) {
                $noTeamMemberExist = "id NOT IN ($member_ids)  AND";
            }
            $query = " SELECT `id`,`google_name`,`designation`,`google_picture_link` FROM " . self::TAB_USER . " WHERE $noTeamMemberExist id <> 1 AND status <> 0 AND id <> :id AND google_name LIKE '%$searchKeyword%' ORDER BY google_name";
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':id' => $login_user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_team_member_details($login_user_id) {
        $dbh = $this->get_connection();
        if ($dbh) {

            $query = "SELECT u.google_name, u.id, uh.manager_id, u.designation, google_picture_link FROM " . self::TAB_USER . " as u LEFT JOIN " . self::TAB_USER_HIERARCHY . " uh on u.id = uh.user_id WHERE u.id = :user_id AND uh.role_type_id = 1";
            $profile_data = $dbh->prepare($query);
            $profile_data->execute(array(':user_id' => $user_id));
            $row = $profile_data->fetch((PDO::FETCH_ASSOC));
            if (is_array($row)) {
                return $row;
            } else {
                $query = "SELECT * FROM " . self::TAB_USER . " WHERE " . self::COL_TAB_USER_ID . " = :id";
                $profile_data = $dbh->prepare($query);
                $profile_data->execute(array(':id' => $login_user_id));
                $row = $profile_data->fetch((PDO::FETCH_ASSOC));
                if (isset($row) && !empty($row)) {
                    return $row;
                }
            }
        }
    }

    function rate_team_mem_plus($data) {

        $dbh = $this->get_connection();
        if ($dbh) {
            $dateTime = new \DateTime();
            $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
            $login_user_id = $_SESSION['userinfo']->id;
            $data['comment'] = $data['work_desc'];
            $data['user_id'] = $data['for_id'];

            $work_insert_query = "INSERT INTO " . self::TAB_WORK . "(" . self::TAB_WORK_USER_ID . ", " . self::TAB_WORK_TITLE . ", " . self::TAB_WORK_DESCRIPTION . ", " . self::TAB_WORK_CREATED_BY . ", " . self::TAB_WORK_FOR_ID . ", " . self::TAB_WORK_REQUEST_FOR . ", " . self::TAB_WORK_CREATED_DATE . ", " . self::TAB_WORK_MODIFIED_DATE . ", " . self::TAB_WORK_WORK_DATE . ")
                                                                VALUES(:user_id,:work_title,:work_description,:created_by,:for_id,:request_for,:created_date,:modified_date,:work_date)";
            $work_insert = $dbh->prepare($work_insert_query);
            $work_insert->execute(array(':user_id' => $data['user_id'],
                ':work_title' => $data['work_title'],
                ':work_description' => $data['work_desc'],
                ':created_by' => $login_user_id,
                ':request_for' => '1',
                ':for_id' => $data['for_id'],
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':work_date' => ''));

            $work_last_insert = $dbh->lastInsertId();

            $request_insert_query = "INSERT INTO " . self::TAB_REQUEST . "(" . self::TAB_REQUEST_FROM_ID . ", " . self::TAB_REQUEST_TO_ID . ", " . self::TAB_REQUEST_STATUS . ", " . self::TAB_REQUEST_WORK_ID . ", " . self::TAB_REQUEST_CREATED_DATE . ", " . self::TAB_REQUEST_MODIFIED_DATE . ", " . self::TAB_REQUEST_SHOW . ")
                                                                         VALUES(:from_id,:to_id,:status,:work_id,:created_date,:modified_date,:show_request)";
            $request_insert = $dbh->prepare($request_insert_query);
            $request_insert->execute(array(':from_id' => $login_user_id,
                ':to_id' => $data['user_id'],
                ':status' => '2',
                ':work_id' => $work_last_insert,
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':show_request' => '1'));

            $request_last_insert = $dbh->lastInsertId();

            $rating_insert_query = "INSERT INTO " . self::TAB_RATING . "(" . self::TAB_RATING_REQUEST_ID . "," . self::TAB_RATING_WORK_ID . ", " . self::TAB_RATING_USER_ID . ", " . self::TAB_RATING_RATING . ", " . self::TAB_RATING_GIVEN_BY . ", " . self::TAB_RATING_CREATED_DATE . ", " . self::TAB_RATING_MODIFIED_DATE . ", " . self::TAB_RATING_SHOW_RATING . ")
                                                                         VALUES(:request_id,:work_id,:user_id,:rating,:given_by,:created_date,:modified_date,:show_rating)";
            $rating_insert = $dbh->prepare($rating_insert_query);
            $rating_insert->execute(array(
                'request_id' => $request_last_insert,
                ':work_id' => $work_last_insert,
                ':user_id' => $data['for_id'],
                ':rating' => '1',
                ':given_by' => $login_user_id,
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ':show_rating' => '2'));
            if (!empty($data)) {
                notifyAwardOne($data);
            }
        }
        return true;
    }

    function get_all_sub_employee_list($login_user_id) {

        global $employeeList;
        $dbh = $this->get_connection();
        if ($dbh) {

            $query = 'SELECT  uh.user_id,u.google_name FROM user_hierarchy uh left join users u on u.id = uh.user_id ' .
                    'WHERE manager_id = :id  AND u.status <> 0 group by user_id';

            $user_data = $dbh->prepare($query);
            $user_data->execute(array(':id' => $login_user_id));

            while ($row = $user_data->fetch((PDO::FETCH_ASSOC))) {

                $membresInfo = array();
                $membresInfo = array('user_id' => $row['user_id'], 'user_name' => $row['google_name']);
                $employeeList[] = $membresInfo;
                $this->get_all_sub_employee_list($row['user_id']);
            }
        }
        return $employeeList;
    }

    function get_my_team_mem($login_user_id) {
        global $str;
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT user_id FROM " . self::TAB_USER_HIERARCHY . " WHERE manager_id = :id ";
            $user_data = $dbh->prepare($query);
            $user_data->execute(array(':id' => $login_user_id));

            while ($row = $user_data->fetch((PDO::FETCH_ASSOC))) {
                $str .= $row['user_id'] . ',';
                $this->get_my_team_mem($row['user_id']);
            }
            return $str;
        }
    }

    function get_lead_role($login_user_id, $lead_id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "select if(role_type_id =3 ,'Manager','Lead') as role_name FROM " . self::TAB_USER_HIERARCHY . " where manager_id = :lead_id AND user_id = :id";
            $lead_data = $dbh->prepare($query);
            $lead_data->execute(array(':id' => $login_user_id, ':lead_id' => $lead_id));
            $row = $lead_data->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }

    function get_ranking_list($login_user_id) {
        $dbh = $this->get_connection();
        $testUserArr = '37,38,48';
        $result = array();
        if ($dbh) {
          
            if (ENVIRONMENT === 'LIVE') {
                
                $condition = " AND r.user_id NOT IN ($testUserArr)";
            } else {

                $condition = "";
            };
              $query = "select MAX(r.created_date) as date,r.user_id,u.google_name,u.google_picture_link as image,
                           sum(case when r.rating = 1 then 1  end) as pluscount,
                           sum(case when r.rating = 0 then 1  end) as minuscount
                           from " . self::TAB_RATING . " as r join " . self::TAB_USER . " as u ON (u.id =r.user_id) WHERE u.status <> 0  $condition
                           group by r.user_id ORDER BY pluscount DESC, minuscount ASC,date ASC LIMIT 10";
            $ranking_data = $dbh->prepare($query);
            $ranking_data->execute(array(':id' => $login_user_id));

            $rating = '';
            $name = '';
            $data = '';
            $flag = 'FALSE';
            while ($row = $ranking_data->fetch((PDO::FETCH_ASSOC))) {
                
                switch ($row['pluscount']) {
                    case $row['pluscount'] > 25:
                          $position = $row['pluscount'] + 10;
                        break;
                    case $row['pluscount'] > 5 & $row['pluscount'] < 25:
                        $position = $row['pluscount'] + 5;
                        break;
                    default:
                        $position = $row['pluscount'] + 2;
                        break;
                }

                if ($row['user_id'] == $login_user_id) {
                    $flag = 'TRUE';
                    $rating .= "{'y':" . $row['pluscount'] . ",'color':'#0075a0'}" . ",";
                } else {

                    $rating.= $row['pluscount'] . ',';
                }
                $profile_pic = ($row['image'] != '') ? $row['image'] . "" : 'https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg';
                $image = $profile_pic . '?size=40';
                $fname = $row['google_name'];
                $name.="'$fname'" . ',';
                
                $data.= "{y:$position, marker: {symbol: 'url($image)'}}" . ',';
            }
        
            $result['ratings'] = rtrim($rating, ',');
            $result['name'] = rtrim($name, ",");
            $result['data'] = rtrim($data, ',');
        }
        return $result;
    }

    function get_all_members_cnt() {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT count(*) as totalusercnt FROM " . self::TAB_USER . " WHERE status <> 0";
            $user_data = $dbh->prepare($query);
            $user_data->execute();
            $row = $user_data->fetch((PDO::FETCH_ASSOC));
            if (isset($row) && !empty($row)) {
                return $row;
            }
        }
    }

    function get_my_rank_position() {
        $dbh = $this->get_connection();
        $testUserArr = '37,38,48';
        if ($dbh) {
            
            if (ENVIRONMENT === 'LIVE') {

                $condition = " AND r.user_id NOT IN ($testUserArr)";
            } else {

                $condition = "";
            };

            $query ="select MAX(r.created_date) as date, r.user_id,u.google_name,u.google_picture_link as image,
                           sum(case when r.rating = 1 then 1  end) as pluscount,
                           sum(case when r.rating = 0 then 1  end) as minuscount
                           from " . self::TAB_RATING . " as r join " . self::TAB_USER . " as u ON (u.id =r.user_id) WHERE u.status <> 0 $condition
                           group by r.user_id ORDER BY pluscount DESC, minuscount ASC,date ASC";
            $rank_data = $dbh->prepare($query);
            $rank_data->execute();
            $row = $rank_data->fetchAll((PDO::FETCH_ASSOC));
         }
        return $row;
    }
    
    function get_recent_ratings() {
         $dbh = $this->get_connection();
        if ($dbh) {
            $MonthFirstDate = date('Y-m-01');
            $query = "SELECT r.user_id,u.google_name,u.google_picture_link,u.designation,if(c.comment_text <> '',c.comment_text,w.description) AS description"
                    . " FROM " . self::TAB_RATING . " as r LEFT JOIN " . self::TAB_WORK . " AS w ON (w.id =r.work_id)"
                    . " LEFT JOIN " . self::TAB_COMMENT . " AS c on (c.request_id = r.request_id) JOIN " . self::TAB_USER . " AS u ON (u.id = r.user_id) WHERE description <> '' AND r.rating <> 0 ORDER BY r.created_date DESC LIMIT 3";
            $rank_data = $dbh->prepare($query);
            $rank_data->execute();
            $row = $rank_data->fetchAll((PDO::FETCH_ASSOC));
        }
        return $row;
    }
    
     function get_user_total_rating_count($user_id){
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT count(user_id) as pluscount FROM " . self::TAB_RATING . " AS r  WHERE r.user_id = :id AND r.rating <> 0";
            $ranking_data = $dbh->prepare($query);
            $ranking_data->execute(array(':id' => $user_id));
            $row = $ranking_data->fetch((PDO::FETCH_ASSOC));
        }
        return $row;
    }
    
    function login_log($user_id){
	$today = date('Y-m-d H:i:s');
        $dbh = $this->get_connection();
        if ($dbh) {
            $user_log_query = "INSERT INTO  " . self::TAB_USER_LOG . " (" . self::COL_USER_LOG_USERID . ", " . self::COL_USER_LOG_LOGINDATETIME . ", " . self::COL_USER_LOG_LOGOUTDATETIME . ")
                     VALUES(:user_id,:login_datetime,:logout_datetime)";
            $user_log_data = $dbh->prepare($user_log_query);
            $user_log_data->execute(array(':user_id' => $user_id,':login_datetime' => $today,':logout_datetime' => ''));
            $request_last_insert = $dbh->lastInsertId();
        }
        return $request_last_insert;
    }
    
    function logut_log($log_id){
    
	$today = date('Y-m-d H:i:s');
        $dbh = $this->get_connection();
        if ($dbh) {
            $user_log_query = "UPDATE " . self::TAB_USER_LOG . " SET " . self::COL_USER_LOG_LOGOUTDATETIME . " = '".$today."' where ".self::COL_USER_LOG_ID." = ".$log_id;
            $user_log_data = $dbh->prepare($user_log_query);
            $user_log_data->execute();
        }
    }
    
    function saveFeedback($data) {
    
        //$data['work_title'] = "System generated";
        $data['feedback_desc'] = $data['desc'];
        $dbh = $this->get_connection();
        if ($dbh) {
            $dateTime = new \DateTime();
            $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
            $login_user_id = $_SESSION['userinfo']->id;

            $feedback_insert_query = "INSERT INTO " . self::TAB_FEEDBACK . "(" . self::TAB_FEEDBACK_TO . ", " . self::TAB_FEEDBACK_DESCRIPTION . ", " . self::TAB_FEEDBACK_FROM . ", " . self::TAB_FEEDBACK_CREATED_DATE . ", " . self::TAB_FEEDBACK_MODIFIED_DATE . ")
                                                                VALUES(:feedback_to,:feedback_description,:feedback_from,:created_date,:modified_date)";
            $feedback_insert = $dbh->prepare($feedback_insert_query);
            $feedback_insert->execute(array(':feedback_to' => $data['user_id'],
                //':work_title' => $data['work_title'],
                ':feedback_description' => $data['feedback_desc'],
                ':feedback_from' => $login_user_id,
                //':request_for' => $data['rating'],
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ));
             if (isset($data['action']) && ($data['action'] == 'btn_click'))
                 notifyFeedback($data);
            return true;
        }
    }
    
    function get_feedback($user_id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT feedback.feedback_to as feedback_to,feedback.feedback_from as feedback_from,feedback.id as id,feedback.feedback_description as description,feedback.created_date as created_date,user.google_name as given_by_name"
                    . " FROM " . self::TAB_FEEDBACK . " AS feedback  
                    LEFT JOIN " . self::TAB_USER . " AS user ON user.id = feedback.feedback_from
                    WHERE feedback.feedback_to= :user_id AND (feedback.response_parent=0 OR feedback.response_parent is NULL) ORDER BY feedback.created_date desc ";
                    
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':user_id' => $user_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }
    
    function get_response($feedback_id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT feedback.feedback_from as feedback_from,feedback.id as id,feedback.feedback_description as description,feedback.created_date as created_date,user.google_name as given_by_name,user1.google_name as name"
                    . " FROM " . self::TAB_FEEDBACK . " AS feedback  
                    LEFT JOIN " . self::TAB_USER . " AS user ON user.id = feedback.feedback_from
                    LEFT JOIN " . self::TAB_USER . " AS user1 ON user1.id = feedback.feedback_to    
                    WHERE feedback.response_parent= :feedback_id ORDER BY feedback.created_date asc ";
                    
            $user_list = $dbh->prepare($query);
            $user_list->execute(array(':feedback_id' => $feedback_id));
            $row = $user_list->fetchAll((PDO::FETCH_ASSOC));
            return $row;
        }
    }
    
    function feedbackResponseSave($data) {
        
        $data['feedback_desc'] = $data['desc'];
        $dbh = $this->get_connection();
        if ($dbh) {
            $dateTime = new \DateTime();
            $created_date = $modified_date = $dateTime->format("Y-m-d H:i:s");
            $login_user_id = $_SESSION['userinfo']->id;

            $feedback_insert_query = "INSERT INTO " . self::TAB_FEEDBACK . "(" . self::TAB_FEEDBACK_TO . ", " . self::TAB_FEEDBACK_DESCRIPTION . ", " . self::TAB_FEEDBACK_FROM . ", ".self::TAB_FEEDBACK_RESPONSE_PARENT.", " . self::TAB_FEEDBACK_CREATED_DATE . ", " . self::TAB_FEEDBACK_MODIFIED_DATE . ")
                                                                VALUES(:feedback_to,:feedback_description,:feedback_from,:response_parent,:created_date,:modified_date)";
                                                         
            $feedback_insert = $dbh->prepare($feedback_insert_query);
            $feedback_insert->execute(array(':feedback_to' => $data['feedback_to'],
                //':work_title' => $data['work_title'],
                ':feedback_description' => $data['feedback_desc'],
                ':feedback_from' => $login_user_id,
                ':response_parent' => $data['feedback_id'],
                ':created_date' => $created_date,
                ':modified_date' => $modified_date,
                ));
              if (isset($data['action']) && ($data['action'] == 'btn_click')){
                  notifyFeedback($data,'response');
              }  
            return true;
        }
    }
    
    function get_feedback_title($feedback_id) {
        $dbh = $this->get_connection();
        if ($dbh) {
            $query = "SELECT feedback.feedback_description as description,feedback.feedback_from as feedback_from"
                    . " FROM " . self::TAB_FEEDBACK . " AS feedback  
                    WHERE feedback.id= :feedback_id ";
                    
            $feedbackTitle = $dbh->prepare($query);
            $feedbackTitle->execute(array(':feedback_id' => $feedback_id));
            $row = $feedbackTitle->fetch((PDO::FETCH_ASSOC));
            return $row;
        }
    }
    
    function date_compare($a, $b) {
      $t1 = strtotime($a['created_date']); 
      $t2 = strtotime($b['created_date']); 
      return $t2 - $t1; 
    }
    
    function sort_date($result) {
      usort($result, array('rating','date_compare'));
      return $result;
    }
    
}
