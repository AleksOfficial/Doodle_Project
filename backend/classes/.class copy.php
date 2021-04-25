<?php

class Sending_mails 
{
  
  //Create Method sends the message with a hashtoken & type of mail. Returns the mail
  public function generate_mail($url_token, $mail_type,$creator_name = NULL)
  {

    $content = $this->get_content($url_token, $mail_type,$creator_name);
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->SMTPOptions = array(
      'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => true,
        'allow_self_signed' => false,
      )
    );
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPAuth = true;
    $mail->Username = 'myfirstpythonscript28@gmail.com';
    $mail->Password = 'Y2GdLZb7HnKsUrB';
    $mail->setFrom('myfirstpythonscript28@gmail.com', 'Doodle Clone - Appointment');
    $mail->addAddress($user['email']);
    $mail->Subject = 'RIFT Account: Password-Reset';
    $mail->msgHTML($content);
    return $mail;

  }

  public function get_content($url_token, $mail_type, $creator_name = NULL)
  {
    $url_token = "localhost/doodle_project/index.html?".$url_token;
    if($mail_type === "invite")
    {
      $content = file_get_contents("../emails/email_invite.1php");
      $content = str_replace("{{name}}",$creator_name,$content);
    }
    if($mail_type === "created")
    $content = file_get_contents("../emails/email_created.php");
    if($mail_type === "almost_closed")
    $content = file_get_contents("../emails/email_poll_almost_closed.php");
    if($mail_type === "closed")
    $content = file_get_contents("../emails/email_poll_closed.php");
    $content = str_replace("{{action_url}}", $url_token, $content);
    return $content;
  }

  //Create Method to check database for running polls and their status; The sending stuff could actually also be implemented by the nodejs stuff...
  //public

  
  //sending invites method, takes in an array and a creator, which then in turn sends out the mails
  public function send_invites($email_array,$creator)
  {
    $creator_mail = $this->generate_mail($creator["url_token"],"created");
    $all_mails = [];
    foreach($email_array as $email)
    {
      $new_mail = $this->generate_mail($email['url_token'],"invite",$creator["name"]);
      array_push($all_mails,$new_mail);
    }
  }
}

