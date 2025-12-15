<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Ensure this path points to your actual database connection file
include 'db.php'; 

$data = json_decode(file_get_contents("php://input"));

// Check if we received the Username, the Backup Code, and the New Password
if (isset($data->username) && isset($data->backup_code) && isset($data->new_password)) {
    
    $user = $conn->real_escape_string(trim($data->username));
    $input_code = trim($data->backup_code);
    $new_pass = trim($data->new_password);
    // --- NEW: Check Password Length ---
if (strlen($new_pass) < 6 || strlen($new_pass) > 8) {
    echo json_encode(["success" => false, "message" => "Password must be 6-8 characters long."]);
    exit();
}
// ----------------------------------

    // 1. Find User ID based on the username
    $check = $conn->query("SELECT id FROM users WHERE username = '$user'");
    
    if ($check->num_rows > 0) {
        $userData = $check->fetch_assoc();
        $user_id = $userData['id'];

        // 2. Fetch ALL unused recovery codes for this specific user
        // We select 'id' (to mark it used later) and 'code' (the hash to verify)
        $codeQuery = $conn->query("SELECT id, code FROM recovery_codes WHERE user_id = '$user_id' AND is_used = 0");
        
        $code_found = false;
        $code_db_id = 0;

        // 3. Verify the input code against the hashed codes in the database
        while ($row = $codeQuery->fetch_assoc()) {
            if (password_verify($input_code, $row['code'])) {
                $code_found = true;
                $code_db_id = $row['id'];
                break; // We found a match, stop looping
            }
        }

        if ($code_found) {
            // --- SUCCESS: The code is valid ---
            
            // A. Mark this specific code as USED so it cannot be used again
            $conn->query("UPDATE recovery_codes SET is_used = 1 WHERE id = '$code_db_id'");

            // B. Hash the NEW password
            $new_hashed_pass = password_hash($new_pass, PASSWORD_DEFAULT);
            
            // C. Update the user's password in the users table
            $update = $conn->query("UPDATE users SET password = '$new_hashed_pass' WHERE id = '$user_id'");

            if ($update) {
                echo json_encode(["success" => true, "message" => "Password updated successfully!"]);
            } else {
                echo json_encode(["success" => false, "message" => "Database Error: Could not update password."]);
            }

        } else {
            echo json_encode(["success" => false, "message" => "Invalid or already used recovery code."]);
        }

    } else {
        echo json_encode(["success" => false, "message" => "User not found."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing data. Please provide username, code, and new password."]);
}
$conn->close();
?>