<?php
    require_once 'config.php';
    require_once 'class/rating.php';

    if(isset($_POST['Login'])) {
      
       $email = $_REQUEST['email'];
       $password = $_REQUEST['password'];
       $renderObj = new rating();
       $status = $renderObj->admin_login($email,$password);
       if(isset($_SESSION['userinfo']) && ($_SESSION['userinfo']->role_id == 8)) {
            $last_inser_id = $renderObj->login_log($_SESSION['userinfo']->id);
            $_SESSION['log_id']= $last_inser_id;
            header('Location: user_list_page.php');
        } else {
            header('Location: admin.php?err=1');
        }
    }
    
    require_once 'header.php';
    ?>
    <?php require_once "error.php"; ?>

    <div class="mid-col-12">
      <?php  
        if($_GET['err']!= '') {
      ?>
        <div class="alert alert-danger">
          <strong>Opps !</strong> Please Login with given credentials.
        </div>
         <?php }       ?>
        <div class="panel panel-info">
            <div class="loginBox panel-heading ">
                <div class="panel-title">Sign In</div>
                <div style="float:right; font-size: 80%; position: relative; top:-10px"><a href="#">Forgot password?</a></div>
            </div>     
            
            <div class="panel-body" style="padding-top:30px">
                <div class="alert alert-danger col-sm-12" id="login-alert" style="display:none"></div>
                    <form role="adminLogin" class="form-horizontal" id="adminLogin" action="#" method="POST">
                        <div class="input-group" style="margin-bottom: 25px">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                            <input type="email" placeholder="Email" class="form-control" required="required" name="email" id="form_email">
                        </div>
                        <div class="input-group" style="margin-bottom: 25px">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                            <input type="password" placeholder="password" name="password" class="form-control" required="required" >
                        </div>
                        <div class="form-group" style="margin-top:10px">
                            <!-- Button -->

                            <div class="col-sm-12 controls">
                                <input type="submit" name="Login" value="Login" class="btn btn-success" href="#" id="btn-login">
                            </div>
                        </div>
                    </form>     
                </div>                     
            </div> 
    </div> 
    <link href="css/bootstrap.css" rel="stylesheet" type="text/css" />     
<?php
    require_once 'footer.php';
?>