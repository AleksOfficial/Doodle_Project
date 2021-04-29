<?php


function debugLog(string $log)
{
    file_put_contents("debug.txt", $log);
}


spl_autoload_register(function ($class) {
    include_once "../classes/" . $class . ".class.php";
});

//Entry Point


//Send mails 
if (isset($_GET['closing_polls'])) {

    $db_con = new DB_get_invites();

    //Query DB - Look for Polls that are ending within 5 minutes and which ended exactly at that minute, retrieve title/e_id/baselink
    $polls = $db_con->get_closing_polls();

    $mailer = new Sending_mails();

    //Go through each closed poll, get all the associated invites and send the closed mail
    foreach ($polls[0] as $poll) {
        $invites = $db_con->get_invites($poll['p_e_id']);
        foreach ($invites as $invite)
            $mailer->send_closed($poll, $invite["a_recipient_email"]);
    }
    foreach ($polls[1] as $poll) {
        $invites = $db_con->get_invites($poll['p_e_id']);
        foreach ($invites as $invite)
            $mailer->send_almost_closed($poll, $invite["a_recipient_email"]);
    }
}

//Get Appointment data
if (isset($_GET['baselink'])) {

    $_db = new Db_get_appointments();
    $data = $_db->get_appointment($_GET['baselink']);

    if ($data != null) {
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo "Error: Event not found!";
    }
}

//Create Poll
if (isset($_POST['a_title'])) {
    /*var_dump($_POST);
    exit;*/
    $connector = new Db_create_stuff();
    $mailer = new Sending_mails();
    $hash = $connector->create_appointment($_POST);
    if ($hash != NULL) {
        http_response_code(200);
        $hashArray['a_baselink'] =  $hash[0];
        $hashArray['a_admin_hash'] = $hash[1];
        echo json_encode($hashArray); // Eckige Klammern?
    } else {
        http_response_code(500);
        echo $connector->errorMessage;
    }
}

//Vote on Poll
if (isset($_POST['votes'])) {
    $connector = new Db_create_stuff();
    $hash = $connector->create_vote($_POST);
    debugLog("blabla");
    if ($hash != NULL) {
        http_response_code(200);
        //debugLog($hash);
        $hashArray['p_hashbytes'] =  $hash;
        echo json_encode($hashArray); // Eckige Klammern?
    } else {
        //debugLog("fail");
        http_response_code(500);
        echo $connector->errorMessage;
    }
}

//Delete Votes . This has a weird post thing. 
if (isset($_POST["p_hashbytes"])) {
    $connector = new Db_create_stuff();
    if ($connector->delete_vote($_POST)) {
        http_response_code(200);
        echo json_encode([true]);
    } else {
        http_response_code(500);
        echo json_encode([false]); // was on true;
    }
}

//Delete Poll ONLY POSSIBLE AS ADMIN
if (isset($_POST["a_admin_hash"])) {
    $alter_table = new Db_alter_event();
    $x = $alter_table->delete_event($_POST);
    if ($x) {
        http_response_code(200);
        echo json_encode([true]);
    } else {
        http_response_code(500);
        echo json_encode([false]);
    }
}

//Create additional timeslot
if (isset($_POST["timeslot_baselink"])) {
    $db_ = new Db_create_stuff();
    $x = $db->create_new_timeslot($_POST);
    if($x)
    {
        http_response_code(200);
        echo json_encode([true]);
    } else {
        http_response_code(500);
        echo json_encode([false]);
    }
}
//Create Comment
if(isset($_POST["a_text"]))
{
    $db = new Db_create_stuff();
    $x = $db->create_comment($_POST);
    if ($x) {
        http_response_code(200);
        echo json_encode([true]);
    } else {
        http_response_code(500);
        echo json_encode([false]);
    }
}
//Send Emails to ppl
if(isset($_POST['emails']))
{
    
    $db = new Db_create_stuff();
    $x = $db->create_emails($_POST);
    
    if ($x) {
        http_response_code(200);
        echo json_encode([true]);
    } else {
        http_response_code(500);
        echo json_encode([false]);
    }

}