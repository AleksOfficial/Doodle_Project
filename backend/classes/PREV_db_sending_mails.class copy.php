<?php

class Db_pw_reset extends Db_con
{
  public function send_request_reset($POST_array)
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
  public function update_db_pw_reset($array)
  {


    $selector = bin2hex(random_bytes(8));
    $token = random_bytes(32);
    $sendtoken = bin2hex($token);

    $url = "localhost/webtech/webdev_project/sites/reset_pw.php?selector=$selector&validator=$sendtoken"; // URL CHANGES IF THE FOLDER STRUCTURE IS DIFFERENT!
    $db_con = new Db_user();
    $user = $db_con->get_user_by_email($array['email']);
    $con = $db_con->connect();
    $query1 = "DELETE FROM password_reset WHERE person_id = ?";
    $id = $user['person_id'];

    $stmt = $con->prepare($query1);
    if (!$stmt) {
      echo "There was an error!";
      exit(); 
    }
    $stmt->execute([$id]);
    $query2 = "INSERT INTO password_reset (person_id,selector,token,created_on) VALUES (?,?,?,CURRENT_TIMESTAMP)";
    $stmt = $con->prepare($query2);
    if (!$stmt) {
      echo "There was an error!";
      exit();
    } else {
      $hashedToken = password_hash($token, PASSWORD_DEFAULT);
      $stmt->execute([$id, $selector, $hashedToken]);
    }
    return [$user, $url];
  }
  public function generate_email($username, $url)
  {
    $content = file_get_contents("../sites/email.php");
    $content = str_replace("{{name}}", $username, $content);
    $content = str_replace("{{action_url}}", $url, $content);
    return $content;
  }
  public function password_reset($pw1, $pw2, $selector)
  {

    if($pw1 === $pw2)
    {
      $con = $this->connect();
      $pw_hash = password_hash($pw1,PASSWORD_DEFAULT);
      $query1 = "SELECT person_id FROM password_reset WHERE selector = ?";
      $stmt = $con->prepare($query1);
      $stmt->execute([$selector]);
      $id=$stmt->fetch()['person_id'];
      //$query = "UPDATE person SET person.password_hash = ? WHERE password_reset.selector = ? FROM person INNER JOIN person.person_id = password_reset.person_id";
      $query2 = "UPDATE person SET password_hash = ? WHERE person_id = ?";
      $stmt = $con->prepare($query2);
      $result = $stmt->execute([$pw_hash,$id]);
      if($result == NULL)
      {
        $this->error("it's empty... ");
        return NULL;
      }
      else
      return $result;
    }
  }
}
