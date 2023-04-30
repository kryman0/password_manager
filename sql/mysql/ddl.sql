-- setup tables
-- ------------


-- use database
use password_manager;


-- create users
create table if not exists users (
    email varchar(128) not null unique primary key,
    password varchar(512) not null
);


-- create passwords
create table if not exists passwords (
    title varchar(128) not null,
    username varchar(256) null,
    password varchar(256) null,
    url varchar(512) null,
    description varchar(512) null,
    user_email varchar(128) not null references users(email)
);
