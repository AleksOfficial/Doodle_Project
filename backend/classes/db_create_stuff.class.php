<?php
class Db_create_stuff extends Db_con
{
    //It would probably be nice to have some form of error class instead of handling the errors everywhere individually with each function
    //Then you'd have a consistent error handling. Lack of time makes this quite difficult tho. We might come back to this at some point

    public $errorMessage = "";
    private $pdo;
    private $error_occured;
    private $error_missing;
    private $missing_data = [];
    function __construct()
    {
        $this->pdo = $this->connect();
        $this->error_missing = "Error, following data is missing: ";
        $this->error_occured = false;
    }

    
    /// -- Check Data Functions -- 
    function check_appointmentdata($array)
    {
        //required fields
        if (!isset($array["a_creator_name"]) || empty($array["a_creator_name"])) {
            array_push($this->missing_data, "Your name (creator name).");
            $this->error_occured = true;
        }
        if (!isset($array["a_creator_email"]) || empty($array["a_creator_email"])) {
            array_push($this->missing_data, "Your E-mail address (creator email).");
            $this->error_occured = true;
        }
        if (!isset($array["a_end_date"]) || empty($array["a_end_date"])) {
            array_push($this->missing_data, "An end date for the poll.");
            $this->error_occured = true;
        }
        if (!isset($array["a_title"]) || empty($array["a_title"])) {
            array_push($this->missing_data, "A title for your appointment.");
            $this->error_occured = true;
            if (!isset($array["timeslots"]) || empty($array["timeslots"])) {
                array_push($this->missing_data, "Timeslots to vote for your event.");
                $this->error_occured = true;
            }
            if (!(gettype($array["timeslots"]) == "array")) {
                array_push($this->missing_data, "Timeslots is not an array.");
                $this->error_occured = true;
            }
        }
        //not required fields
        if (!isset($array["a_description"])) {
            $array["a_description"] = "";
        }
        if (!isset($array["a_location"])) {
            $array["a_location"] = "";
        }
        if ($this->error_occured) {
            $this->error($this->error_missing, $this->missing_data);
            $this->error_occured = false;
            $this->error_missing = [];
            return false;
        }
        return true;
    }

    function check_timeslotdata($array)
    {
        //check if the data is set and not empty
        if (!isset($array["a_start"]) || empty($array["a_start"])) {
            array_push($this->missing_data, "A start date for the timeslot.");
            $this->error_occured = true;
        }
        if (!isset($array["a_end"]) || empty($array["a_end"])) {
            array_push($this->missing_data, "An end date for the timeslot.");
            $this->error_occured = true;
        }
        if ($this->error_occured) {
            $this->error($this->error_missing, $this->missing_data);
            $this->error_occured = false;
            $this->error_missing = [];
            return false;
        }
        return true;
    }

    function check_votedata($array)
    {
        if($this->check_timeslotdata($array))
        {
            if(!isset($array["a_baselink"]) || empty($array["a_baselink"]))
            {
                array_push($this->missing_data, "Baselink to identify the event.");
                $this->error_occured = true;
            }
            if(!isset($array["a_name"]) || empty($array["a_name"]))
            {
                array_push($this->missing_data, "Your name to identify the vote.");
                $this->error_occured = true;
            }
            if ($this->error_occured) {
                $this->error($this->error_missing, $this->missing_data);
                $this->error_occured = false;
                $this->error_missing = [];
                return false;
            }
            return true;
        }
        else
            return false;
    }

    /// -- Create Entries Functions --

    //create Timeslots
    function create_timeslot($timeslot, $foreign_key)
    {
        if ($this->check_timeslotdata($timeslot)) {
            $timeslot["f_e_id"] = $foreign_key;
            $query = "INSERT INTO t_timeslots (f_e_id,a_start,a_end) VALUES(?,?,?)";
            $stmt = $this->pdo->prepare($query);
            $timeslot = $this->convert_to_timeslot($timeslot);
            $stmt->execute($timeslot);
        }
    }
    //create invites
    function create_invites($email, $foreign_key)
    {
        $query = "INSERT INTO t_invites (a_recipient_email,f_e_id) VALUES (?,?)";
        $stmt = $this->pdo->prepare($query);
        $x = $stmt->execute([$email, $foreign_key]);
        if ($x)
            return true;
        $this->error($stmt->errorInfo()[2]);
    }

    //create Appointment entry
    function create_appointment($array)
    {

        //Check if all the necessary data is inserted
        if ($this->check_appointmentdata($array)) {
            while (42) {
                //All data is set, create Hashbytes
                $array["a_baselink"] = bin2hex(random_bytes(32));
                //check if the hashbytes are in the database
                $query = "SELECT a_baselink FROM t_events WHERE a_baselink LIKE ?";
                $stmt = $this->pdo->prepare($query);
                $x = $stmt->execute([$array["a_baselink"]]);
                if ($x) {
                    if ($stmt->fetch() == NULL)
                        break;
                } else {
                    $this->error($stmt->errorInfo()[2]);
                    http_response_code(500);
                    return NULL;
                }
            }

            //Create appointment
            $appointment = $this->convert_to_appointment($array);
            $query = "INSERT INTO t_events (a_end_date,a_creator_name,a_creator_email,a_baselink,a_title, a_location, a_description) 
                VALUES (STR_TO_DATE(?,'%Y-%m-%d'),?,?,?,?,?,?);";
            $stmt = $this->pdo->prepare($query);
            $x = $stmt->execute($appointment);


            if (!$x) {
                $this->errorMessage = $stmt->errorInfo()[2];
                return NULL;
            }

            $foreign_key = $this->pdo->lastInsertId();

            //Create Timeslot entries
            foreach ($array["timeslots"] as $timeslot) {
                $this->create_timeslot($timeslot, $foreign_key);
            }

            //Check if emails are available, if so, create invites on for everyone; all the invites create also accordingly emails, and sends them
            if (isset($array["emaillist"]))
                if (!empty($array["emaillist"]) && (gettype($array["emaillist"]) == "array")) {
                    foreach ($array["emaillist"] as $email) {
                        if (!$this->create_invites($email, $foreign_key))
                            return NULL;
                    }
                }
            return $array["a_baselink"];
        }
        return NULL;
    }
    function create_vote($array)
    {
        if($this->check_votedata($array))
        {
            //Insert the vote 
            $vote = $this->convert_to_vote($array); //This thing does more than it seems. it retrieves the event id and Time id
            $insert_query = "INSERT INTO t_votes (pf_i_id, pf_time_id, a_name) VALUES(?,?,?);";
            $stmt = $this->pdo->prepare($insert_query);
            $x = $stmt = $this->pdo->prepare($insert_query);
            if($x)
                return true;
            else{
                $this->error($stmt->errorInfo()[2]);
                return false;
            }
            
        }
    }

    //This could also be called if votes need to be unique
    //Deselect an option function 
    function delete_vote($array){
        if($this->check_votedata($array))
        {
            $vote = $this->convert_to_vote($array);
            $query = "DELETE 
                      FROM t_votes 
                      WHERE pf_e_id = ? AND pf_time_id = ? AND a_name LIKE ?";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($vote);


        }
    }


    //This should be somewhere else... own class for get votes? 
    function get_votes($baselink)
    {
        $query = "SELECT *
        FROM t_votes
        INNER JOIN t_timeslots ON t_votes.pf_time_id = t_timeslots.p_time_id
        INNER JOIN t_events ON t_votes.pf_e_id = t_events.p_e_id
        WHERE t_events.baselink LIKE ?";
        $stmt = $this->pdo->prepare($query);
        $x = $stmt->execute([$baselink]);
        if($x) {
            return $stmt->fetchAll();
        }
        else {
            $this->error($stmt->errorInfo()[2]);
            return NULL;
        }      
    }
}
