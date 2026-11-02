<?php
$configFile = __DIR__ . '/db.config.php';
$config = is_file($configFile) ? require $configFile : [];

$host = $config['host'] ?? '127.0.0.1';
$user = $config['user'] ?? 'root';
$pass = $config['pass'] ?? '';
$db   = $config['database'] ?? 'kni_travels';
$port = $config['port'] ?? 3325;

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>