<?php
  class Invite{
    private $a_baselink;
    private $a_hashbytes;
    public $a_title;
    public $a_recipient_email;
    public $a_creator_name;
    public $a_creator_email;
    
    function __construct($array_db)
    {
        $this->a_baselink = $array_db['a_baselink'];
        
    }

  }
/*SELECT t_ FROM t_invites INNER JOIN t_mail as Recipient ON t_invites.f_m_id = Recipient.p_m_id INNER JOIN t_events ON t_invites.f_e_id = t_events.p_e_id INNER JOIN t_events as creator creator.*/
?>  
SELECT t_invites.a_hashbytes, joined_events.a_baselink, joined_events.a_title, joined_invite.a_recipient_email,joined_events.a_creator_name, joined_events.a_creator_email
FROM t_invites
INNER JOIN (SELECT t_mail.a_email as a_recipient_email FROM t_mail) AS joined_invite
ON t_invites.f_m_id = joined_invite.p_m_id
INNER JOIN (SELECT t_events.p_e_id, t_events.f_m_id as creator_id, t_events.a_baselink FROM t_events) as joined_events
ON joined_events.creator_id = t_mail.p_m_id;

SELECT t_invites.a_hashbytes, joined_events.a_baselink, joined_invite.a_recipient_email,joined_events.a_name as a_creator_name, joined_events.a_email as a_creator_email
FROM t_invites
INNER JOIN (SELECT t_mail.a_email as a_recipient_email FROM t_mail) AS joined_invite
ON t_invites.f_m_id = joined_invite.p_m_id
LEFT JOIN (SELECT t_events.p_e_id, t_events.f_m_id as creator_id, t_events.a_baselink FROM t_events) as joined_events
ON joined_events.creator_id = t_mail.p_m_id;

First, the tables events and mail need to be joined before joining them with invites, otherwise you'll receive just the table from before. 