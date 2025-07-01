<?php
$host = 'localhost';
$dbname = 'uas_akhir';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Log the error instead of echoing it directly in production
    error_log("Database connection failed: " . $e->getMessage());
    // Optionally, display a user-friendly error message
    http_response_code(500);
    echo "Internal Server Error";
    exit();
}

// Fungsi untuk koneksi mysqli (untuk produk.php)
function getConnection() {
    global $host, $dbname, $username, $password;
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        http_response_code(500);
        echo "Internal Server Error";
        exit();
    }
    
    return $conn;
}
?> 