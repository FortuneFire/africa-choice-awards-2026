
<?php

header("Content-Type: application/json");

session_start();

require "config.php";

/* =========================
   ALLOW POST ONLY
========================= */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "status" => "error",
        "message" => "Invalid request"
    ]);

    exit;

}


/* =========================
   HONEYPOT SPAM CHECK
========================= */

if (!empty($_POST["website"])) {

    echo json_encode([
        "status" => "error",
        "message" => "Spam detected"
    ]);

    exit;

}


/* =========================
   SIMPLE RATE LIMIT
========================= */

if (
    isset($_SESSION["last_submit"]) &&
    (time() - $_SESSION["last_submit"] < 10)
) {

    echo json_encode([
        "status" => "error",
        "message" => "Please wait before submitting again"
    ]);

    exit;

}

$_SESSION["last_submit"] = time();


/* =========================
   SANITIZE INPUTS
========================= */

$first_name = trim($_POST["first_name"] ?? "");
$last_name = trim($_POST["last_name"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$organization = trim($_POST["organization"] ?? "");
$country = trim($_POST["country"] ?? "");
$type = trim($_POST["type"] ?? "");
$notes = trim($_POST["notes"] ?? "");


/* =========================
   VALIDATION
========================= */

if (
    empty($first_name) ||
    empty($last_name) ||
    empty($email)
) {

    echo json_encode([
        "status" => "error",
        "message" => "Required fields missing"
    ]);

    exit;

}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    echo json_encode([
        "status" => "error",
        "message" => "Invalid email address"
    ]);

    exit;

}


/* =========================
   INSERT INTO DATABASE
========================= */

$stmt = $conn->prepare("
    INSERT INTO registrations
    (
        first_name,
        last_name,
        email,
        phone,
        organization,
        country,
        type,
        notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {

    echo json_encode([
        "status" => "error",
        "message" => "Database prepare failed"
    ]);

    exit;

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

$success = $stmt->execute();


/* =========================
   RESPONSE
========================= */

if ($success) {

    echo json_encode([
        "status" => "success",
        "message" => "Registration submitted successfully"
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Database insert failed"
    ]);

}

$stmt->close();

$conn->close();

?>

