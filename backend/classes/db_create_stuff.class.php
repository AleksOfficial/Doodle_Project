<?php
class Db_create_stuff extends Db_con{
    private $pdo;

    function __construct()
    {
        $this->pdo = $this->connect();
    }

    //create Timeslots
    //create invites
    //Create email address
    //create vote
    //create Appointment
    function create_appointment($array){
        
    }
}
?>