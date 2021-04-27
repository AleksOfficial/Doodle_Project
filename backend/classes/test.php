<?php
include_once("db_con.class.php");
include_once("db_create_stuff.class.php");
$array["a_baselink"] = "6f6c29ef68a793e8b1f6132070536ef87c3cd74ea5d406c459d7abf238e6425b";
$array["votes"] = [];
$array["votes"][0]["a_name"] = "Peter";
$array["votes"][0]["a_start"] = "2021-04-27 00:00:00";
$array["votes"][0]["a_end"] = "2021-04-27 00:00:00";
$array["votes"][0]["a_hashbytes"] = "";
$connector = new Db_create_stuff();
echo $connector->create_vote($array);
