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
            INNER JOIN (SELECT p_m_id, a_email as a_creator_email, a_name FROM t_mail) m
            ON e.f_m_id = m.p_m_id
            WHERE a_baselink = ? ";
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
}
