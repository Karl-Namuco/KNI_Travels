<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'db.php'; // Ensure db.php is in the backend folder

$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->password)) {
    $user = trim($data->username);
    $pass = trim($data->password);

    // 1. SELECT ROLE along with ID and Password
    $query = "SELECT id, username, password, role FROM users WHERE username = ? LIMIT 1";
    
    // Using MySQLi syntax since your db.php uses MySQLi
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // 2. Verify Password
        if (password_verify($pass, $row['password'])) {
            echo json_encode([
                "success" => true, 
                "message" => "Login successful!",
                "user" => [
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "role" => $row['role'] // SEND ROLE TO FRONTEND
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid password."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "User not found."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>