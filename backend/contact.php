<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Ensure this points to your existing db.php

$data = json_decode(file_get_contents("php://input"));

if(isset($data->name) && isset($data->email) && isset($data->message)){
    $name = $conn->real_escape_string(trim($data->name));
    $email = $conn->real_escape_string(trim($data->email));
    $message = $conn->real_escape_string(trim($data->message));

    if(empty($name) || empty($email) || empty($message)){
         echo json_encode(["success" => false, "message" => "Please fill in all fields."]);
         exit();
    }

    $sql = "INSERT INTO contacts (name, email, message) VALUES ('$name', '$email', '$message')";

    if($conn->query($sql) === TRUE){
        echo json_encode(["success" => true, "message" => "Message sent successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>