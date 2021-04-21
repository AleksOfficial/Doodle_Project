<?php

class Db_sending_mails extends Db_con
{
  public function send_request_reset($Array)
  {
    $outputs = $this->update_db_pw_reset($POST_array);
    if (!$outputs) {
      return;
    }
    $user = $outputs[0];
    $url = $outputs[1];
    $content = $this->generate_email($user['first_name'], $url);

    $mail = new PHPMailer();
    $mail->isSMTP();

    //var_dump(openssl_get_cert_locations());
    //$mail->SMTPDebug = SMTP::DEBUG_CONNECTION;
    $mail->SMTPOptions = array(
      'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => true,
        'allow_self_signed' => false,

      )

    );
    //var_dump($mail->SMTPOptions['ssl']);
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    //$mail->SMTPSecure = "tls";
    $mail->SMTPAuth = true;
    $mail->Username = 'myfirstpythonscript28@gmail.com';
    $mail->Password = 'Y2GdLZb7HnKsUrB';
    $mail->setFrom('myfirstpythonscript28@gmail.com', 'RIFT No-Reply');
    $mail->addAddress($user['email']);
    $mail->Subject = 'RIFT Account: Password-Reset';
    $mail->msgHTML($content);
    //$mail->AltBody = 'This is a plain-text message body';
    if (!$mail->send()) {
      echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
      echo $this->success('An E-Mail has been sent to the address provided! Check the Link in your inbox!');
    }
  }

  //Create Method sends the message with a hashtoken & type of mail. if there was an error, it should return false, which is later important for inserting in the DB

  //Create Method to check database for running polls and their status; The sending stuff could actually also be implemented by the nodejs stuff...
  
  //sending invites method, takes in an array and a creator, which then in turn sends out the mails

  public function token_checker($selector, $hextoken)
  {
    if (!empty($selector) || !empty($hextoken)) {
      if (ctype_xdigit($selector) && ctype_xdigit($hextoken)) {
        $con = $this->connect();
        $query = "SELECT * FROM password_reset WHERE selector = ?";
        $stmt = $con->prepare($query);
        $stmt->execute([$selector]);
        $data = $stmt->fetch();
        if($data == NULL)
        {
          $this->error("No such token found!");
          return false;
        }
        $token = hex2bin($hextoken);
        $expire = $data['created_on'];
        //missing: checking if the token has expired or not
        if (password_verify($token, $data['token'])) {
          return true;
        }
        else
          $this->error("Error: Token do not match with the one in Database!");
      }
      $this->error("Error: Tokens of wrong datatype!");
    }
    $this->error("Error: No Tokens provided");
    return false;
  }

  public function generate_email($username, $url)
  {
    $content = file_get_contents("../sites/email.php");
    $content = str_replace("{{name}}", $username, $content);
    $content = str_replace("{{action_url}}", $url, $content);
    return $content;
  }
  
  }

