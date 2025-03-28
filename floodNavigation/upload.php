<?php

$hostname = "localhost";
$username = "root";
$password = "";
$database = "flood_navigation";

// Establishing connection to the database
$conn = mysqli_connect($hostname, $username, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Database connection is OK<br>";

if (isset($_POST)) {
    $d = $_POST["distance"];
    $ip = $_POST["sensor_id"];

    // Prepare and execute the SQL query
    $sql = "INSERT INTO sensor_readings (sensor_initial_reading,sensor) VALUES ($d,$ip);"; //double check make sure that you code INSERT INTO database name

    if (mysqli_query($conn, $sql)) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
}

// Close the database connection
mysqli_close($conn);
