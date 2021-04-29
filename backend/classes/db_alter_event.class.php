<?php

class Db_alter_event extends Db_con
{

    function __construct()
    {
        $this->pdo = $this->connect();
    }

    function delete_event($array)
    {
        if(isset($array['a_baselink']) && !empty($array['a_baselink']) && !empty($array['a_admin_hash']))
        {
            //check which event is in the baselink attached
            $query = "SELECT p_e_id FROM t_events WHERE a_baselink LIKE ? AND a_admin_hash LIKE ?";
            $stmt = $this->pdo->prepare($query);
            $x = $stmt->execute([$array['a_baselink'],$array['a_admin_hash']]);
            if($x){
                $e_id = $stmt->fetch();
                if($e_id)
                {
                    $e_id = $e_id['p_e_id'];
                    $del_query = "DELETE FROM t_events WHERE p_e_id = ?";
                    $stmt = $this->pdo->prepare($del_query);
                    $x = $stmt->execute([$e_id]);
                    if($x)
                        return true;
                    else
                    {
                        $this->error($stmt->errorInfo()[2]);
                        return false;
                    }

                }
            }
        }
    }
}