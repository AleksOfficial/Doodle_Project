<?php
include_once("db_con.class.php");
include_once("db_create_stuff.class.php");
spl_autoload_register(function ($class) {
    include_once "../classes/" . $class . ".class.php";
});
$array["a_baselink"] = "a74996e3150fa35d258808bed8a78845a806f523db3b2bb114c23bbbc55af0e8";
$array["emails"] = [];
$array["emails"][0] = "aleks.jevtic315@gmail.com";
$array["emails"][1] = "smith.joney1@gmail.com";


$con = new Db_create_stuff();
$x = $con->create_emails($array);
if($x)
    echo "hello!";
else
    echo "fail";
