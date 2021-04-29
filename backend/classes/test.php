<?php
include_once("db_con.class.php");
include_once("db_create_stuff.class.php");
$array["a_baselink"] = "a6bfde95bb93676c335b3483811d95665faf0b16bc06cf154ac52fdba01cf2b1";
$array["a_name"] = "Bob";
$array["a_text"] = "This is my first comment.";
$con = new Db_create_stuff();
$x = $con->create_comment($array);
if($x)
    echo "hello!";
else
    echo "fail";
