<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db   = 'kni_travels';
$port = 3325; // <--- THIS MUST MATCH YOUR XAMPP SCREENSHOT

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>