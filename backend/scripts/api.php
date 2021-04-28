<?php


function debugLog(string $log)
{
    file_put_contents("debug.txt", $log);
}


spl_autoload_register(function ($class) {
    include_once "../classes/" . $class . ".class.php";
});

function getData($baselink)
{


    $_db = new Db_get_appointments();
    $data = $_db->get_appointment($baselink);
    return $data;
    /*
    $data["a_end_date"] = "2021-04-30T00:00";
    $data["a_title"] = "Testevent";
    $data["a_location"] = "Teststraße";
    $data["a_description"] = "Testbeschreibung";
    $data["a_name"] = "Test Testersson";
    $data["a_creator_email"] = "testi@test.com";
    $data["timeslots"] = [];
    $data["timeslots"][0]["a_start"] = "2021-04-30T12:00";
    $data["timeslots"][0]["a_end"] = "2021-04-30T13:00";
    $data["timeslots"][1]["a_start"] = "2021-04-30T14:00";
    $data["timeslots"][2]["a_end"] = "2021-04-30T15:00";
    return $data;*/
}

function responsePullAppointment($data)
{
    if ($data != null) {
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo "Error: Event not found!";
    }
}

function responsePushAppointment($data)
{
    if ($data != null) {
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo "Error: Event could not be saved!";
    }
}

//Entry Point
//Post


if(isset($_GET['closing_polls']))
{

    $db_con = new DB_get_invites();

    //Query DB - Look for Polls that are ending within 5 minutes and which ended exactly at that minute, retrieve title/e_id/baselink
    $polls = $db_con->get_closing_polls();

    $mailer = new Sending_mails();

    //Go through each closed poll, get all the associated invites and send the closed mail
    foreach($polls[0] as $poll)
    {
      $invites = $db_con->get_invites($poll['p_e_id']);
      foreach($invites as $invite)
        $mailer->send_closed($poll,$invite["a_recipient_email"]);
    }  
    foreach($polls[1] as $poll)
    {
      $invites = $db_con->get_invites($poll['p_e_id']);
      foreach($invites as $invite)
        $mailer->send_almost_closed($poll,$invite["a_recipient_email"]);
    }

}


if (isset($_GET['baselink'])) {

    responsePullAppointment(getData($_GET['baselink']));
}


if (isset($_POST['a_title'])) {
    /*var_dump($_POST);
    exit;*/
    $connector = new Db_create_stuff();
    $mailer = new Sending_mails();
    $hash = $connector->create_appointment($_POST);
    if ($hash != NULL) {
        http_response_code(200);
        $hashArray['a_baselink'] =  $hash;
        echo json_encode($hashArray); // Eckige Klammern?
    } else {
        http_response_code(500);
        echo $connector->errorMessage;
    }
}

if (isset($_POST['votes'])) {
    $connector = new Db_create_stuff();
    $hash = $connector->create_vote($_POST);
    debugLog("blabla");
    if ($hash != NULL) {
        http_response_code(200);
        debugLog($hash);
        $hashArray['p_hashbytes'] =  $hash;
        echo json_encode($hashArray); // Eckige Klammern?
    } else {
        debugLog("fail");
        http_response_code(500);
        echo $connector->errorMessage;
    }
}

if (isset($_POST["p_hashbytes"])) {
    $connector = new Db_create_stuff();
    if ($connector->delete_vote($_POST)) {
        http_response_code(200);
        echo json_encode([true]);
    } else {
        http_response_code(500);
        echo json_encode([true]);
    }
}
