<?php
foreach ($_POST as $key => $value) {
    $_POST[$key] = mysql_real_escape_string($value);
  }

//STEP 1 Connect To Database

$connect = mysql_connect("localhost","root","admin");
if (!$connect)
{
die("MySQL could not connect!");
}

$DB = mysql_select_db('stageIt');

if(!$DB)
{
die("My SQL could not select Database!");
}

//STEP 2 Declare Variables

$Username = $_POST['username'];
$Email = $_POST['email'];
$Email1 = "@";
$Email_Check = strpos($Email,$Email1);
$Password = $_POST['password'];
$Re_Password = $_POST['confirmpassword'];

//STEP 3 Check To See If All Information Is Correct

if($Username == "")
{
die("Opps! You don't enter a username!");
}

if($Password == "" || $Re_Password == "")
{
die("Opps! You didn't enter one of your passwords!");
}


if($Password != $Re_Password)
{
die("Ouch! Your passwords don't match! Try again.");
}

if($Email_Check === false)
{
die("Opps! That's not an email!");
}

$Password = hash('sha512', $Password.$salt);

//STEP 4 Insert Information Into MySQL Database

if(!mysql_query("INSERT INTO users (email, username, password)
VALUES ('$Email', '$Username', '$Password')"))
{
die("We could not register you due to a mysql error (Contact the website owner if this continues to happen.)");
}
else{echo "yay!";}

?>