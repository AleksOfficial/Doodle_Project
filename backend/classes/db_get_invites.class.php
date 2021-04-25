<?php

class DB_get_invites extends Db_con
{
  //Query DB - Look for Polls that are ending within 5 minutes and which ended exactly at that minute, retrieve title/e_id/baselink
  public function get_closing_polls()
  {
    $con = $this->connect();
    $query = "SELECT p_e_id, a_title, a_baselink FROM t_events WHERE a_end_date LIKE ? OR a_end_date LIKE ?";
    
    $timestamp1 = new DateTime(); //End Polls
    $timestamp2 = new DateTime(); //5 min remaining polls
    $timestamp2->modify('+5 minutes');
    echo $timestamp1->format('Y-M-d H:i:00');
    echo"<br>";
    echo $timestamp2->format('Y-M-d H:i:00');
    $stmt = $con->prepare($query);
    $x = $stmt->execute([$timestamp1->format('Y-m-d H:i:00'),$timestamp2->format('Y-m-d H:i:00')]);

    if($x)
    {
      return $stmt->fetchAll();
    }
    else
    {
      $this->error($stmt->errorInfo()[2]);
      return NULL;
    }

  }
  
  public function get_invites($e_id)
  {
    $con = $this->connect();
    $query = "SELECT t_invites.
    FROM t_invites 
    WHERE f_e_id = ? INNER JOIN t_invites.f_m_id ON t_mail.p_m_id as Recipient INNER JOIN  ";
    $stmt = $con->prepare($query);
    $x = $stmt->execute([$e_id]);
    
    if($x)
    {
      return $stmt->fetchAll();
    }
    else
    {
      $this->error($stmt->errorInfo()[2]);
      return NULL;
    }
  }


  /*
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
  }*/
}
