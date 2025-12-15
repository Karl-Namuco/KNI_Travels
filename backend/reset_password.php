<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Make sure this matches your actual DB connection filename

$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->new_password)) {
    $username = $data->username;
    $new_pass = $data->new_password;

    // 1. Check if user exists
    $checkQuery = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($checkQuery);

    if($result->num_rows > 0) {
        
        // --- THE FIX: HASH THE PASSWORD BEFORE SAVING ---
        // PASSWORD_DEFAULT uses the standard bcrypt algorithm
        $hashed_password = password_hash($new_pass, PASSWORD_DEFAULT);
        
        // 2. Update using the HASHED password, not the plain text one
        $updateQuery = "UPDATE users SET password = '$hashed_password' WHERE username = '$username'";
        
        if ($conn->query($updateQuery) === TRUE) {
            echo json_encode(["success" => true, "message" => "Password updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Database error"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "User not found"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
}

$conn->close();
?>