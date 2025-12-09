<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// INCLUDE THE CONNECTION FILE (This is the most important line)
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->password)) {
    $user = $conn->real_escape_string(trim($data->username));
    $pass = trim($data->password);

    // Check User
    $check = $conn->query("SELECT id FROM users WHERE username = '$user'");
    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Username taken."]);
    } else {
        // Create User
        $hashed = password_hash($pass, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (username, password, role) VALUES ('$user', '$hashed', 'user')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Account created!"]);
        } else {
            echo json_encode(["success" => false, "message" => "DB Error: " . $conn->error]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
$conn->close();
?>