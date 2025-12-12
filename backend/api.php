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

// 4. BOOK A TRIP
if ($action == 'book' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    error_reporting(0); 
    header('Content-Type: application/json');

    $data = json_decode(file_get_contents("php://input"));
    if(!isset($data->user_id) || !isset($data->trip_id) || !isset($data->total_price)) {
        echo json_encode(["success" => false, "message" => "Missing booking details"]);
        exit;
    }

    $userId = $data->user_id;
    $tripId = $data->trip_id;
    $totalPrice = $data->total_price; // Received from Frontend Modal

    $tripQuery = $conn->query("SELECT title FROM destinations WHERE id = $tripId");
    $trip = $tripQuery->fetch_assoc();

    if ($trip) {
        $title = $trip['title'];

        // Save total price
        $stmt = $conn->prepare("INSERT INTO bookings (user_id, trip_id, trip_title, trip_price) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iisd", $userId, $tripId, $title, $totalPrice);

        if ($stmt->execute()) {
             echo json_encode(["success" => true, "message" => "Booking confirmed!"]);
        } else {
             echo json_encode(["success" => false, "message" => "DB Error: " . $stmt->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Trip not found."]);
    }
    exit;
}

// 5. GET ALL BOOKINGS 
if ($action == 'read_bookings') {
    // We join 'users' table so we can see the Username, not just the User ID
    $sql = "SELECT b.id, u.username, b.trip_title, b.trip_price, b.booking_date 
            FROM bookings b 
            JOIN users u ON b.user_id = u.id 
            ORDER BY b.booking_date DESC";
    
    $result = $conn->query($sql);
    $bookings = [];
    while($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    echo json_encode($bookings);
    exit;
}

// 6. DELETE BOOKING
if ($action == 'delete_booking' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
    $stmt->bind_param("i", $data->id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Booking cancelled/deleted successfully."]);
    } else {
        echo json_encode(["message" => "Error deleting booking."]);
    }
    exit;
}

// 7. GET ALL MESSAGES 
if ($action == 'read_messages') {
    $sql = "SELECT * FROM contacts ORDER BY sent_at DESC";
    $result = $conn->query($sql);
    $messages = [];
    while($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
    echo json_encode($messages);
    exit;
}

// Resolved
if ($action == 'resolve_message' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    // Update status to 'Resolved'
    $stmt = $conn->prepare("UPDATE contacts SET status = 'Resolved' WHERE id = ?");
    $stmt->bind_param("i", $data->id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Message marked as resolved."]);
    } else {
        echo json_encode(["message" => "Error updating message."]);
    }
    exit;
}

//GET USER BOOKINGS
if ($action == 'get_user_bookings') {
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;

    $stmt = $conn->prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC");
    $stmt->bind_param("i", $user_id);
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    while($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    
    echo json_encode($bookings);
    exit;
}
$conn->close();
?>