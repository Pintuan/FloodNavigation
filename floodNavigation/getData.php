<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "flood_navigation";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the latest inserted record(s) from the last minute
$sql = "SELECT sr.sensor_initial_reading, s.sensor_id, s.sensor_coord_x,s.sensor_coord_y, sr.reading_timestamp FROM sensor_readings sr
INNER JOIN sensor s on sr.sensor = s.sensor_id
WHERE reading_timestamp <= NOW() - INTERVAL 1 MINUTE 
ORDER BY  reading_timestamp DESC, sensor_initial_reading ASC";
$result = $conn->query($sql);


$records = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }
    echo json_encode(["success" => true, "data" => $records]);
} else {
    echo json_encode(["success" => false, "message" => "No recent records found"]);
}

$conn->close();
