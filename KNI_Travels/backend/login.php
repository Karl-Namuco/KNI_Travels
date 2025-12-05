
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//mali pag connection nito
// 1. Database Connection (Same as registration)
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

    // 3. Fetch the User based on Username
    // We only need the ID and the Hashed Password from the DB
    $query = "SELECT id, username, password FROM users WHERE username = :username LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":username", $user);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $stored_hash = $row['password'];

        // 4. Verify the Password
        // password_verify(plain_text_password, hashed_password_from_db)
        if (password_verify($pass, $stored_hash)) {
            
            // OPTIONAL: Start a session here if you aren't using tokens
            // session_start();
            // $_SESSION['user_id'] = $row['id'];

            echo json_encode([
                "success" => true, 
                "message" => "Login successful!",
                "user" => [
                    "id" => $row['id'],
                    "username" => $row['username']
                ]
            ]);
        } else {
            // Password incorrect
            echo json_encode(["success" => false, "message" => "Invalid username or password."]);
        }
    } else {
        // Username not found
        // Note: For security, it's often better to say "Invalid username or password" 
        // even if the user doesn't exist, so hackers can't guess valid usernames.
        echo json_encode(["success" => false, "message" => "Invalid username or password."]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>