<?php
require_once "class.phpmailer.php";
require_once "class.smtp.php";
function send_mail($data)
{
    //print_r($data);
    //return;
    if(smtp_send_mail($data['to'], $data['from'], $data['subject'], $data['message'])){
        return true;
    }else{
        return false;
    }
}//end of fun

function smtp_send_mail($to,$from,$subject,$message)
{
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
    $mail->From = (isset($from)) ? $from : FROM_EMAIL;
    $mail->FromName = FROM_NAME;
    $mail->addAddress($to["email"],$to["name"]);     // Add a recipient
    $mail->addReplyTo(FROM_EMAIL, FROM_NAME);
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
