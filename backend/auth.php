<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//mali pa conncetion nito
// 1. Database Connection
$host = "localhost"; 
$db_name = "kni_travels";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Connection failed xd"]);
    exit();
}

// 2. Get Data
$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->password)) {
    $user = trim($data->username);
    $pass = trim($data->password);

    if(empty($user) || empty($pass)) {
        echo json_encode(["success" => false, "message" => "Please fill in all fields."]);
        exit();
    }

    // 3. Check if User Already Exists
    $checkQuery = "SELECT id FROM users WHERE username = :username";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bindParam(":username", $user);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Username already taken."]);
    } else {
        // 4. Create New User
        // Hash the password! Never store plain text.
        $hashed_password = password_hash($pass, PASSWORD_DEFAULT);

        $insertQuery = "INSERT INTO users (username, password) VALUES (:username, :password)";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bindParam(":username", $user);
        $insertStmt->bindParam(":password", $hashed_password);

        if ($insertStmt->execute()) {
            echo json_encode(["success" => true, "message" => "Registration successful! You can now log in."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error creating account."]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>