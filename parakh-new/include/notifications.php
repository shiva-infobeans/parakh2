<?php
require_once "class.phpmailer.php";
require_once "class.smtp.php";
function send_mail($data)
{
//    var_dump($data);
//    die();
//    return;
    $data['subject'] = $data['subject']."----".$data['to']['name'];
//    $data['to']['email'] = MANAGER_EMAIL;
    if(smtp_send_mail($data['to'], $data['from'], $data['from_name'], $data['subject'], $data['message'])){
        return true;
    }else{
        return false;
    }
}//end of fun

function smtp_send_mail($to,$from,$from_name,$subject,$message)
{
    $from = (isset($from)) ? $from : FROM_EMAIL;
    $from_name = (isset($from_name)) ? $from_name : FROM_NAME;
            
    if(empty($to["email"]))    
        return false;
    $mail = new PHPMailer;
    
    //$mail->SMTPDebug = 3;                               // Enable verbose debug output
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'parakh.info@gmail.com';                 // SMTP username
    $mail->Password = 'Info0909';                           // SMTP password
    $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 465;                                    // TCP port to connect to
    $mail->From = $from;
    $mail->FromName = $from_name;
    $mail->addAddress($to["email"],$to["name"]);     // Add a recipient
    $mail->addReplyTo($from, $from_name);
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = $subject;
    $mail->Body    = $message;
    if(!$mail->send()) {
        //echo "email send";
        return true;
    } else {
       return false;
    }
}
