<?php
$host = '127.0.0.1';
$user = 'root';      // Default XAMPP user
$pass = '';          // Default XAMPP password is empty
$db   = 'kni_travels';
$port = 3325;             // Default MySQL port

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>