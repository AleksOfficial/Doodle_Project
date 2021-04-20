<?php
class Db_con
{
  private $host = "localhost";
  private $user = "hello_world";
  private $pwd = "123";
  private $dbName = "webdev_project";

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
    //Cool this works :) maybe we can shift it to the con_class so every function has this capability. This way you can use it for posts as well.
    $date_msg = new DateTime($timestamp);
    $now = date('D d M Y H:i:s');
    $date_now = new DateTime($now);
    $diff = $date_now->diff($date_msg);

    if ($diff->y) {
      return $date_msg->format('D, d M Y H:i');
    }
    if ($diff->m) {
      return $date_msg->format('D, d M Y H:i');
    }
    if ($diff->d) {
      if ($diff->d < 10)
        return $diff->d . " day" . ($diff->y > 1 ? "s" : "") . " ago. - " . $date_msg->format('D, d M Y H:i');
      else
        return $date_msg->format('D, d M Y H:i:s');
    }
    if ($diff->h) {
      return $diff->h . " hour" . ($diff->h > 1 ? "s" : "") . " ago - " . $date_msg->format('H:i');
    }
    if ($diff->i) {
      return $diff->i . " minute" . ($diff->i > 1 ? "s" : "") . " ago. - " . $date_msg->format('H:i');
    }
    if ($diff->s) {
      if ($diff->s < 30) {
        return "under 30 seconds ago. - " . $date_msg->format('H:i');
      } else {
        return "under a minute ago. - " . $date_msg->format('H:i');
      }
    }
    return "Now";
  }
  function get_not_user($from_to_array, $user_id)
  {
    if ($from_to_array['from_id'] == $user_id)
      return $from_to_array['to_id'];
    else
      return $from_to_array['from_id'];
  }
  function get_hashtags($string, $str = 1) {
    preg_match_all('/#(\w+)/',$string,$matches);
    $i = 0;
    $keywords = "";
    $keyword = array();
    if ($str) {
        foreach ($matches[1] as $match) {
            $count = count($matches[1]);
            $keywords .= "$match";
            $i++;
            if ($count > $i) $keywords .= ", ";
        }
    } else {
        foreach ($matches[1] as $match) {
            $keyword[] = $match;
        }
        $keywords = $keyword;
    }
    return $keywords;
  }
  function convert_text_to_hashtag($string,$word,$dots)
  {
    $string = preg_replace('/(?<!\S)#([0-9a-zA-Z]+)/', "<a href='$dots/sites/search_result.php?search_value=%23$word&search_submit=1'>#$word</a>", $string,1);
    return $string;
  }
  function count_tags()
  {
    $con = $this->connect();
    $query = "SELECT COUNT(*) AS amount_tagged , tag.tag_text FROM all_tags JOIN tag ON all_tags.tag_id = tag.tag_id GROUP BY tag_text";
    $stmt = $con->prepare($query);
    $x = $stmt->execute();
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

}
