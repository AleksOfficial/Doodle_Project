<?php
class Database extends Db_con
{
    private $pdo;

    function __construct()
    {
        $pdo = $this->connect();
    }

    function getAppointment($baseLink)
    {
        $query = "SELECT *
            FROM t_events e INNER JOIN t_timeslots t ON e.p_e_id = t.f_e_id
            WHERE a_baselink = ? ";
        $stmt = $this->pdo->prepare($query);
        $x = $stmt->execute([$baseLink]);

        if ($x) {
            $data = $stmt->fetchAll();
            $return = [];
            for ($i = 0; $i < 8; $i++) {
                $return[$i] = $data[$i];
            }
            foreach ($data as $row) {
                $return
            }
        } else {
            $this->error($stmt->errorInfo()[2]);
            return NULL;
        }
    }
}
