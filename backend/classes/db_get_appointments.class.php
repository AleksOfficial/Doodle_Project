<?php
class Db_get_appointments extends Db_con
{
    private $pdo;

    function __construct()
    {
        $this->pdo = $this->connect();
    }

    function get_appointment($baseLink)
    {
        //This can be either just one query or 2. We will split this up into 2 for clearance.
        $query = "SELECT *
            FROM t_events e
            WHERE e.a_baselink = ? ";
        $stmt = $this->pdo->prepare($query);
        $x = $stmt->execute([$baseLink]);

        if ($x) {
            //Return all entries with Timeslots, then at the position timeslots of
            $appointment = $stmt->fetch();
            if (!$appointment) {
                //$this->error("Error: Appointment not found in the Database");
                return NULL;
            }
            $appointment["timeslots"] = $this->get_timeslots_to_appointment($appointment['p_e_id']);
            $appointment["votes"] = $this->get_votes($appointment["a_baselink"]);
            return $appointment;
        } else {
            $this->error($stmt->errorInfo()[2]);
            return NULL;
        }
    }
    function get_timeslots_to_appointment($e_id)
    {
        $query = "SELECT * from t_timeslots WHERE f_e_id = ?";
        $stmt = $this->pdo->prepare($query);
        $x = $stmt->execute([$e_id]);
        if ($x)
            return $stmt->fetchAll();
        else {
            $this->error($stmt->errorInfo()[2]);
            return NULL;
        }
    }

    //This should be somewhere else... own class for get votes? 
    function get_votes($baselink)
    {
        $query = "SELECT t_timeslots.a_start, t_timeslots.a_end, t_votes.a_name, t_votes.p_hashbytes
        FROM t_votes
        INNER JOIN t_timeslots ON t_votes.pf_time_id = t_timeslots.p_time_id
        INNER JOIN t_events ON t_votes.pf_e_id = t_events.p_e_id
        WHERE t_events.a_baselink LIKE ?";
        $stmt = $this->pdo->prepare($query);
        $x = $stmt->execute([$baselink]);
        if ($x) {
            return $stmt->fetchAll();
        } else {
            $this->error($stmt->errorInfo()[2]);
            return NULL;
        }
    }
}
