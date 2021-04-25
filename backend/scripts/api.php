<?php
function getData($baselink)
{
    $data = [];
    $database = new Database();
    $rows = $database->getAppointment($baselink);
    $data
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

if (isset($_GET['method']) && isset($_GET['param'])) {
    response(getData($_GET['method'], $_GET['param']));
} else {
    response(null);
}

if (isset($_POST['']));