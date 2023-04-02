-- setup user and database
-- -----------------------


-- delete database
drop database if exists password_manager;


-- delete roles
drop role if exists 'app_read'@'localhost', 'app_write'@'localhost';


-- delete users
drop user if exists password_manager;


-- create database
create database if not exists password_manager
    character set = utf8mb4
    collate = utf8mb4_general_ci;


-- create roles
create role if not exists 'app_read'@'localhost', 'app_write'@'localhost';


-- create user
create user if not exists password_manager
    identified with caching_sha2_password by 'regular_user-1@password_manager-33'
    default role 'app_read'@'localhost', 'app_write'@'localhost'
    failed_login_attempts 5
    password_lock_time 3;


-- grant privileges to roles
grant delete, execute, insert, select, update
    on password_manager.*
    to 'app_read'@'localhost', 'app_write'@'localhost';


-- grant roles to user
grant 'app_read'@'localhost', 'app_write'@'localhost' to password_manager;
