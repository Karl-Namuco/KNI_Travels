<?php
header('Content-Type: application/json');
include 'db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. GET ALL DESTINATIONS
if ($action == 'read') {
    $sql = "SELECT * FROM destinations";
    $result = $conn->query($sql);
    $destinations = [];
    
    while($row = $result->fetch_assoc()) {
        $destinations[] = $row;
    }
    echo json_encode($destinations);
}

// 2. ADD NEW DESTINATION
if ($action == 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON input
    $data = json_decode(file_get_contents("php://input"), true);
    
    $title = $conn->real_escape_string($data['title']);
    $location = $conn->real_escape_string($data['location']);
    $price = $conn->real_escape_string($data['price']);
    $image = $conn->real_escape_string($data['image']);

    $sql = "INSERT INTO destinations (title, location, price, image_url) VALUES ('$title', '$location', '$price', '$image')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Destination created successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
}

// 3. UPDATE PRICE
if ($action == 'update_price' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $id = $data['id'];
    $newPrice = $data['price'];

    $sql = "UPDATE destinations SET price='$newPrice' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Price updated successfully"]);
    } else {
        echo json_encode(["error" => "Error updating record: " . $conn->error]);
    }
}
// Inside api.php

if ($action === 'delete') {
    // Get the ID from the JS body
    $data = json_decode(file_get_contents("php://input"));
    
    if(isset($data->id)) {
        // DELETE SQL Query
        $stmt = $conn->prepare("DELETE FROM destinations WHERE id = ?");
        $stmt->execute([$data->id]);
        
        echo json_encode(["message" => "Destination deleted successfully"]);
    } else {
        echo json_encode(["message" => "Error: No ID provided"]);
    }
    exit;
}
$conn->close();
?>