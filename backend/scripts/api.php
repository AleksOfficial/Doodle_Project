<?php
function getData($baselink)
{
    $data["a_end_date"] = "2021-04-30T00:00";
    $data["a_title"] = "Testevent";
    $data["a_location"] = "Teststraße";
    $data["a_description"] = "Testbeschreibung";
    return $data;
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

if (isset($_GET['x'])) {
    response(getData($_GET['x']));
} else {
    response(null);
}

//if (isset($_POST['']));
