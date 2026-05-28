<?php

$conn = new mysqli(
    "localhost",
    "aca_user",
    "d{O=e9K;A03F_P5a",
    "mminatshipi_aca_db"
);

if ($conn->connect_error) {
    die("DB connection failed");
}

?>