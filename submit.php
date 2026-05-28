<?php
header("Content-Type: application/json");
session_start();

require "config.php";

/* -----------------------------
   1. Check DB connection
------------------------------*/
if (!$conn) {
    exit(json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]));
}

/* -----------------------------
   2. Allow only POST requests
------------------------------*/
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit(json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]));
}

/* -----------------------------
   3. Honeypot spam protection
------------------------------*/
if (!empty($_POST["website"])) {
    exit(json_encode([
        "status" => "error"
    ]));
}

/* -----------------------------
   4. Simple rate limiting
------------------------------*/
if (!isset($_SESSION["last_submit"])) {
    $_SESSION["last_submit"] = 0;
}

if (time() - $_SESSION["last_submit"] < 10) {
    exit(json_encode([
        "status" => "error",
        "message" => "Too many requests"
    ]));
}

$_SESSION["last_submit"] = time();

/* -----------------------------
   5. Collect + sanitize input
------------------------------*/
$first_name   = trim($_POST["first_name"] ?? "");
$last_name    = trim($_POST["last_name"] ?? "");
$email_raw    = $_POST["email"] ?? "";
$email        = filter_var($email_raw, FILTER_VALIDATE_EMAIL);

$phone        = trim($_POST["phone"] ?? "");
$organization = trim($_POST["organization"] ?? "");
$country      = trim($_POST["country"] ?? "");
$type         = trim($_POST["type"] ?? "");
$notes        = trim($_POST["notes"] ?? "");

/* -----------------------------
   6. Validate required fields
------------------------------*/
if (!$first_name || !$last_name) {
    exit(json_encode([
        "status" => "error",
        "message" => "Name is required"
    ]));
}

if (!$email) {
    exit(json_encode([
        "status" => "error",
        "message" => "Invalid email address"
    ]));
}

/* -----------------------------
   7. Insert into database
------------------------------*/
$stmt = $conn->prepare("
    INSERT INTO registrations 
    (first_name, last_name, email, phone, organization, country, type, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    exit(json_encode([
        "status" => "error",
        "message" => "Prepare failed: " . $conn->error
    ]));
}

$stmt->bind_param(
    "ssssssss",
    $first_name,
    $last_name,
    $email,
    $phone,
    $organization,
    $country,
    $type,
    $notes
);

/* -----------------------------
   8. Execute + response
------------------------------*/
if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Registration saved"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();