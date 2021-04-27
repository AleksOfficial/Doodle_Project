CREATE DATABASE doodle_project;
-- Main Tables
/*
  main tables:
  
  - t_comments
  - t_invites
  - t_events
  - t_timeslots

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
  a_recipient_email INTEGER NOT NULL
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
  pf_e_id INTEGER NOT NULL,
  pf_time_id INTEGER NOT NULL,
  p_hashbytes VARCHAR(64) NOT NULL,
  a_name VARCHAR(64),
  CONSTRAINT PK_votes PRIMARY KEY(pf_e_id, pf_time_id, p_hashbytes)
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
  ADD CONSTRAINT FK_votes_invites FOREIGN KEY(pf_e_id) REFERENCES t_events(p_e_id) ON DELETE CASCADE;

-- Creating Indices
CREATE INDEX e_baselink ON t_events(a_baselink);
CREATE INDEX time_start ON t_timeslots(a_start);
CREATE INDEX time_end ON t_timeslots(a_end);
CREATE INDEX votes_hashbytes ON t_votes(p_hashbytes);
