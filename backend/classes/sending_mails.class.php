<?php

class Sending_mails 
{
  
  //Create Method sends the message with a hashtoken & type of mail. Returns the mail
  public function generate_mail($poll, $mail_type,$recipient_mail)
  {
    $subject = "";
    $content = $this->get_content($poll, $mail_type,$subject);
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
    $mail->setFrom('myfirstpythonscript28@gmail.com', 'Doodle Clone - Appointment Finder');
    $mail->addAddress($recipient_mail);
    $mail->Subject = $subject;
    $mail->msgHTML($content);
    return $mail;
  }

  public function get_content($poll, $mail_type, &$subject)
  {
    //var_dump($poll);
    $url_token = "localhost/doodle_project/index.html?x=".$poll['a_baselink'];
    if($mail_type === "invite")
    {
      $content = file_get_contents("../emails/email_invite.php");
      $content = str_replace("{{creator_name}}",$poll["a_creator_name"],$content);
      $subject = "Doodle Clone: You received a new Appointment from ".$poll["a_creator_name"]."!";
    }
    if($mail_type === "created"){
      $content = file_get_contents("../emails/email_created.php");
      $subject = "Doodle Clone: You created a new event! Congrats!";
    }
    if($mail_type === "almost_closed")
    {
      $content = file_get_contents("../emails/email_poll_almost_closed.php");
      $subject = "Doodle Clone: A Poll you have been invited to is ending in 5 minutes!";
    }
    if($mail_type === "closed")
    {
      $content = file_get_contents("../emails/email_poll_closed.php");
      $subject = "Doodle Clone: Poll closed - View the result here!";
    }
    $content = str_replace("{{action_url}}", $url_token, $content);
    $content = str_replace("{{title}}", $poll["a_title"], $content);
    $content = str_replace("{{a_end_date}}", $poll["a_end_date"], $content);
    return $content;
  }

  //Create Method to check database for running polls and their status; The sending stuff could actually also be implemented by the nodejs stuff...
  //public
  
  
  //Takes in the Poll and the recipient mail, generates and sends a mail to the recipient.
  public function send_invites($array)
  {
    $mail = $this->generate_mail($array,"invite",$array["a_recipient_email"]);
    //var_dump($mail);
      if($mail != NULL)
        if(!$mail->send())
        {
          var_dump($mail->ErrorInfo);
        };
    //var_dump($x);
  }
  public function send_closed($poll,$recipient_email)
  {
    $mail = $this->generate_mail($poll,"closed",$recipient_email);
    if($mail != NULL)
      $mail->send();
  }
  public function send_almost_closed($poll,$recipient_email)
  {
    $mail = $this->generate_mail($poll,"almost_closed",$recipient_email);
    if($mail != NULL)
      $mail->send();
  }
  public function send_creator($poll)
  {
    $mail = $this->generate_mail($poll,"created",$poll["a_creator_email"]);
    if($mail!=NULL)
      $x = $mail->send();
  }
}

