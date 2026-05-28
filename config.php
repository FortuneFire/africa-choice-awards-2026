
<?php

$conn = new mysqli(
    "localhost",
    "mminatshipi_aca_db",
    "d{O=e9K;A03F_P5a",
    "mminatshipi_aca_db"
);

if ($conn->connect_error) {

    die("DB connection failed: " . $conn->connect_error);

}

?>

