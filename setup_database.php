<?php
// Setup database dan tabel
$host = 'localhost';
$username = 'root';
$password = '';

try {
    // Koneksi ke MySQL tanpa memilih database
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Setup Database</h2>";
    
    // Buat database jika belum ada
    $pdo->exec("CREATE DATABASE IF NOT EXISTS uas_akhir");
    echo "✅ Database 'uas_akhir' berhasil dibuat/ditemukan<br>";
    
    // Pilih database
    $pdo->exec("USE uas_akhir");
    echo "✅ Database 'uas_akhir' dipilih<br>";
    
    // Buat tabel users
    $sql_users = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        address TEXT
    )";
    $pdo->exec($sql_users);
    echo "✅ Tabel 'users' berhasil dibuat/ditemukan<br>";
    
    // Buat tabel products
    $sql_products = "CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT DEFAULT 0,
        category VARCHAR(100),
        description TEXT,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    $pdo->exec($sql_products);
    echo "✅ Tabel 'products' berhasil dibuat/ditemukan<br>";
    
    // Cek jumlah tabel
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<br>📊 Total tabel dalam database: " . count($tables) . "<br>";
    echo "Tabel yang ada: " . implode(", ", $tables) . "<br>";
    
    echo "<br>🎉 Setup database selesai! Sekarang Anda bisa menjalankan test_connection.php untuk memverifikasi koneksi.";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?> 