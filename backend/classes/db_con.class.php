<?php
//Inherit from this class in order to get DB functionality
abstract class Db_con
{
  private $host = "localhost";
  private $user = "hello_world";
  private $pwd = "123";
  private $dbName = "doodle_project";

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
    return date('D d M Y H:i:s',$diff);
  }
//This stuff can probably be solved with some implode function or so. getting all the keys and then looping through the length and appending each element or so
//It will fullfill it's purpose for now tho
  function convert_to_appointment($array)
  {
    $appointment = [];
    $appointment[0] = $array["a_end_date"];
    $appointment[1] = $array["a_creator_name"];
    $appointment[2] = $array["a_creator_email"];
    $appointment[3] = $array["a_baselink"];
    $appointment[4] = $array["a_a_title"];
    $appointment[5] = $array["a_location"];
    $appointment[6] = $array["a_description"];
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

}
