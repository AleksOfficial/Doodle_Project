<?php
class Db_con
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
    //$diff = $date_now->diff($date_msg);
  }

}
