<?php
spl_autoload_register(function($class){include_once "../classes/". $class . ".class.php";});
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

function response($data)
{
    if ($data != null) {
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo "Error with AJAX request: Wrong method name or nonnumeric parameter given.";
    }
}

if (isset($_GET['baselink'])) {
    response(getData($_GET['baselink']));
} else {
    response(null);
}

//if (isset($_POST['']));
