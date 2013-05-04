<?php
session_start(); 
try {  
  # MS SQL Server and Sybase with PDO_DBLIB  
  $DBH = new PDO("mssql:host=$host;dbname=$dbname, $user, $pass");  
  $DBH = new PDO("sybase:host=$host;dbname=$dbname, $user, $pass");  
  
  # MySQL with PDO_MYSQL  
  $DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);  
  
  # SQLite Database  
  $DBH = new PDO("sqlite:my/database/path/database.db");  
}  
catch(PDOException $e) {  
    echo $e->getMessage();  
}   
?>