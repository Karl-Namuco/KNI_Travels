<?php
// REPORT ERRORS
mysqli_report(MYSQLI_REPORT_OFF); // Turn off loud crashes so we can handle them

// TRY OPTION 1: Default XAMPP (No Password)
$conn = @new mysqli('localhost', 'root', '', 'kni_travels');

if (!$conn->connect_error) {
    echo "<h1>✅ SUCCESS!</h1>";
    echo "<p>Your Settings are: <b>Host: localhost, User: root, Password: (empty)</b></p>";
    echo "<p>Please update your db.php to match this.</p>";
    exit();
}

// TRY OPTION 2: Password is 'root' (MAMP/Mac style)
$conn = @new mysqli('localhost', 'root', 'root', 'kni_travels');

if (!$conn->connect_error) {
    echo "<h1>✅ SUCCESS!</h1>";
    echo "<p>Your Settings are: <b>Host: localhost, User: root, Password: root</b></p>";
    echo "<p>Please update your db.php to match this.</p>";
    exit();
}

// TRY OPTION 3: Port 3307 (Sometimes XAMPP runs on a different port)
$conn = @new mysqli('127.0.0.1', 'root', '', 'kni_travels', 3325);

if (!$conn->connect_error) {
    echo "<h1>✅ SUCCESS!</h1>";
    echo "<p>Your Settings are: <b>Host: 127.0.0.1, User: root, Password: (empty), Port: 3307</b></p>";
    echo "<p>Please update your db.php to match this.</p>";
    exit();
}

echo "<h1>❌ EVERYTHING FAILED</h1>";
echo "<p>Please go to http://localhost/phpmyadmin and check the 'User Accounts' tab to see your username and password.</p>";
?>