<?php
  spl_autoload_register(function($class){include_once "../classes/". $class . ".class.php";});

  $db_con = new DB_get_invites();

  //Query DB - Look for Polls that are ending within 5 minutes and which ended exactly at that minute, retrieve title/e_id/baselink
  $polls = $db_con->get_closing_polls();

  //Look for Invites, that have this id, look for the emails attached to this event
  foreach($polls as $poll)
  {
    $invites = $db_con->get_invite_maillist($poll['p_e_id']);
    //Generate Emails
    $emails = [];
    foreach($invites as $invite)
    {
      
    }
  }  
  //$sender = new Sending_mails();
  //$sender->generate_mail("hello_world","invite","bob");

  //Send them
