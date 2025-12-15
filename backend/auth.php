<?php
// ENABLE ERROR REPORTING FOR DEBUGGING
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->password)) {
    $user = $conn->real_escape_string(trim($data->username));
    $pass = trim($data->password);
    // --- NEW: Check Password Length ---
if (strlen($pass) < 6 || strlen($pass) > 8) {
    echo json_encode(["success" => false, "message" => "Password must be 6-8 characters long."]);
    exit(); // Stop everything here
}
// ----------------------------------

    // Check if user exists
    $check = $conn->query("SELECT id FROM users WHERE username = '$user'");
    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Username taken."]);
        exit();
    } 

    // Create User
    $hashed = password_hash($pass, PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (username, password, role) VALUES ('$user', '$hashed', 'user')";
    
    if ($conn->query($sql) === TRUE) {
        $new_user_id = $conn->insert_id;
        $plain_codes = []; 

        // --- DEBUGGING: Check if table exists before loop ---
        $test = $conn->query("SELECT 1 FROM recovery_codes LIMIT 1");
        if ($test === FALSE) {
            echo json_encode(["success" => false, "message" => "Error: 'recovery_codes' table missing!"]);
            exit();
        }

        // Generate 5 codes
        $stmt = $conn->prepare("INSERT INTO recovery_codes (user_id, code) VALUES (?, ?)");
        
        if (!$stmt) {
             // If prepare fails, tell us why
             echo json_encode(["success" => false, "message" => "DB Prepare Error: " . $conn->error]);
             exit();
        }

        for ($i = 0; $i < 5; $i++) {
            $raw_code = bin2hex(random_bytes(4)); 
            $hashed_code = password_hash($raw_code, PASSWORD_DEFAULT);
            $plain_codes[] = $raw_code;

            $stmt->bind_param("is", $new_user_id, $hashed_code);
            
            if (!$stmt->execute()) {
                echo json_encode(["success" => false, "message" => "Insert Failed: " . $stmt->error]);
                exit();
            }
        }
        $stmt->close();

        // Send success
        echo json_encode([
            "success" => true, 
            "message" => "Account created!",
            "backup_codes" => $plain_codes
        ]);

    } else {
        echo json_encode(["success" => false, "message" => "User Insert Error: " . $conn->error]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
$conn->close();
?>