CREATE DATABASE doodle_project;
-- Main Tables
/*
  main tables:
  
  - t_comments
  - t_invites
  - t_events
  - t_timeslots
  - t_hashbytes

fields:
a_* = Attribute
p_* = primary key
f_* = foreign key

*/



CREATE TABLE t_events(
  p_e_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  a_end_date DATETIME NOT NULL,
  a_creator_name VARCHAR(64) NOT NULL,
  a_creator_email VARCHAR(128) NOT NULL,
  a_baselink VARCHAR (64) NOT NULL UNIQUE,
  a_title VARCHAR(100) NOT NULL,
  a_location VARCHAR (64),
  a_description VARCHAR(500)
);

CREATE TABLE t_comments(
  p_c_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  f_e_id INTEGER NOT NULL,
  a_name VARCHAR(64) NOT NULL,
  a_text VARCHAR(500) NOT NULL,
  a_date DATETIME NOT NULL
);

CREATE TABLE t_invites (
  p_i_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  f_e_id INTEGER NOT NULL,
  a_recipient_email INTEGER NOT NULL,  
  CONSTRAINT UQ_invites UNIQUE (f_e_id,a_hashbytes)
);

CREATE TABLE t_timeslots(
  p_time_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  f_e_id INTEGER NOT NULL,
  a_start DATETIME NOT NULL, 
  a_end DATETIME NOT NULL,
  CONSTRAINT UQ_timeslots UNIQUE(f_e_id, a_start, a_end)
);
/*
  Relationship tables:
  - t_votes
*/

CREATE TABLE t_votes(
  pf_i_id INTEGER NOT NULL,
  pf_time_id INTEGER NOT NULL,
  a_name VARCHAR(64),
  CONSTRAINT PK_votes PRIMARY KEY(pf_i_id, pf_time_id)
);
-- Creating Foreign Keys

ALTER TABLE t_invites
  ADD CONSTRAINT FK_invites_events FOREIGN KEY(f_e_id) REFERENCES t_events(p_e_id) ON DELETE CASCADE;

ALTER TABLE t_comments
  ADD CONSTRAINT FK_comments_events FOREIGN KEY(f_e_id) REFERENCES t_events(p_e_id) ON DELETE CASCADE;

ALTER TABLE t_timeslots
  ADD CONSTRAINT FK_timeslots_events FOREIGN KEY(f_e_id) REFERENCES t_events(p_e_id) ON DELETE CASCADE;

ALTER TABLE t_votes
  ADD CONSTRAINT FK_votes_timeslots FOREIGN KEY(pf_time_id) REFERENCES t_timeslots(p_time_id) ON DELETE CASCADE,
  ADD CONSTRAINT FK_votes_invites FOREIGN KEY(pf_i_id) REFERENCES t_invites(p_i_id) ON DELETE CASCADE;