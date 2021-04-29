<?php
//Inherit from this class in order to get DB functionality
abstract class Db_con
{
  private $host = "localhost";
  private $user = "hello_world";
  private $pwd = "123";
  private $dbName = "doodle_project";
  protected $pdo;

  protected function connect()
  {
    $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbName;
    $pdo = new PDO($dsn, $this->user, $this->pwd);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
  }

  public function error($error_msg, $array = NULL)
  {
    if ($array == NULL) {
      echo '<div class="alert alert-danger alert-dismissible fade show float_msg" role="alert">
      ' . $error_msg . '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    } else {
      $string = $error_msg . "<ul>\n";
      foreach ($array as $x) {
        $string = $string . "\n<li>$x</li>\n";
      }
      $string = $string . "</ul>";
      echo '<div class="alert alert-danger alert-dismissible fade show float_msg" role="alert">
      ' . $string . '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    }
  }
  public function success($success_msg)
  {
    echo '<div class="alert alert-success alert-dismissible float_msg" role="alert">
    ' . $success_msg . '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
  }
  function get_timestring($timestamp)
  {
    //This will handle everything with the dates
    $date_database = new DateTime($timestamp);
    $now = date('D d M Y H:i:s');
    $date_now = new DateTime($now);
    $diff = $date_now->diff($date_database);
    return date('D d M Y H:i:s', $diff);
  }
  //This stuff can probably be solved with some implode function or so. getting all the keys and then looping through the length and appending each element or so
  //It will fullfill it's purpose for now tho
  function convert_to_appointment($array)
  {
    $appointment = [];
    $appointment[] = $array["a_end_date"];
    $appointment[] = $array["a_creator_name"];
    $appointment[] = $array["a_creator_email"];
    $appointment[] = $array["a_admin_hash"];
    $appointment[] = $array["a_baselink"];
    $appointment[] = $array["a_title"];
    $appointment[] = $array["a_location"];
    $appointment[] = $array["a_description"];
    return $appointment;
  }
  function convert_to_timeslot($array)
  {
    $timeslot = [];
    $appointment[0] = $array["f_e_id"];
    $appointment[1] = $array["a_start"];
    $appointment[2] = $array["a_end"];
    return $appointment;
  }
  function convert_to_vote($array)
  {
    //Set all variables that are needed to cast a vote, Better for readability
    $hashbytes = $array["p_hashbytes"];
    $baselink = $array["a_baselink"];
    $name = $array["a_name"];
    $start_time = $array["a_start"];
    $end_time = $array["a_end"];
    //Get ID from the event
    $id_query = "SELECT p_e_id FROM t_events WHERE a_baselink LIKE ?";
    $stmt = $this->pdo->prepare($id_query);
    $x = $stmt->execute([$baselink]);
    if ($x) {
      $e_id = $stmt->fetch();
      //set event id from ass. array
      if ($e_id)
        $e_id = $e_id["p_e_id"];
      else {
        $this->error("Error: Could not load associated event ID.");
        return NULL;
      }
    } else {
      $this->error($stmt->errorInfo()[2]);
      return NULL;
    }
    //GET ID from Timeslot
    $time_query = "SELECT p_time_id FROM t_timeslots WHERE a_start = ? AND a_end = ? AND f_e_id = ?";
    $stmt = $this->pdo->prepare($time_query);
    $x = $stmt->execute([$start_time, $end_time, $e_id]);
    if ($x) {
      $time_id = $stmt->fetch();
      if ($time_id)
        $time_id = $time_id["p_time_id"];
      else {
        $this->error("Error: Could not retrieve associated Time ID.");
        return NULL;
      }
    } else {
      $this->error($stmt->errorInfo()[2]);
      return NULL;
    }
    return [$hashbytes, $e_id, $time_id, $name];
  }
  function convert_to_comment($array)
  {
    $comment   = [];
    $comment[] = $array["f_e_id"];
    $comment[] = $array["a_name"];
    $comment[] = $array["a_text"];
    return $comment;
  }
}
