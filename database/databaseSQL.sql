CREATE DATABASE doodle_project;
-- Main Tables
/*
  main tables:
  
  - t_email
  - t_invites
  - t_events
  - t_timeslots
  - t_hashbytes

fields:
a_* = Attribute
p_* = primary key
f_* = foreign key

*/

CREATE TABLE t_mail(
  p_m_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  a_email varchar(160) NOT NULL UNIQUE
);

CREATE TABLE t_events(
  p_e_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  a_end_date DATETIME NOT NULL,
  a_creator_hash VARCHAR(500) NOT NULL,
  a_baselink VARCHAR (64) NOT NULL UNIQUE,
  a_title VARCHAR(100) NOT NULL,
  a_location VARCHAR (64),
  a_description VARCHAR(500)
);

CREATE TABLE t_invites (
  p_i_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  f_e_id INTEGER NOT NULL,
  f_m_id INTEGER,
  a_hashbytes VARCHAR(500) NOT NULL,
  CONSTRAINT UQ_invites UNIQUE (f_e_id,a_hashbytes)
);

CREATE TABLE t_timeslots(
  p_time_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  f_e_id INTEGER NOT NULL,
  a_start DATETIME NOT NULL, 
  a_end DATETIME NOT NULL,
  a_creator_hash VARCHAR(500),
  CONSTRAINT UQ_timeslots UNIQUE(f_e_id, a_start, a_end)
);
/*
  Relationship tables:

  - t_votes
*/

CREATE TABLE t_votes(
  pf_i_id INTEGER,
  pf_time_id INTEGER,
  CONSTRAINT PK_votes PRIMARY KEY(pf_i_id, pf_time_id)
);
-- Creating Foreign Keys

ALTER TABLE t_invites
  ADD CONSTRAINT FK_invites_events FOREIGN KEY(f_e_id) REFERENCES t_events(p_e_id) ON DELETE CASCADE,
  ADD CONSTRAINT FK_invites_mail FOREIGN KEY(f_m_id) REFERENCES t_mail(p_m_id) ON DELETE RESTRICT;

ALTER TABLE t_timeslots
  ADD CONSTRAINT FK_timeslots_events FOREIGN KEY(f_e_id) REFERENCES t_events(p_e_id) ON DELETE CASCADE;

ALTER TABLE t_votes
  ADD CONSTRAINT FK_votes_timeslots FOREIGN KEY(pf_time_id) REFERENCES t_timeslots(p_time_id) ON DELETE CASCADE,
  ADD CONSTRAINT FK_votes_invites FOREIGN KEY(pf_i_id) REFERENCES t_invites(p_i_id) ON DELETE CASCADE;