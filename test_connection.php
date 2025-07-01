<?php
// Test koneksi database
require_once 'config/database.php';

echo "<h2>Test Koneksi Database</h2>";

try {
    // Test PDO connection
    echo "<h3>Test PDO Connection:</h3>";
    $stmt = $pdo->query("SELECT 1");
    echo "✅ PDO Connection: BERHASIL<br>";
    
    // Test database exists
    $stmt = $pdo->query("SELECT DATABASE()");
    $dbName = $stmt->fetchColumn();
    echo "📊 Database yang digunakan: " . $dbName . "<br>";
    
    // Test tables
    echo "<h3>Test Tabel:</h3>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($tables)) {
        echo "⚠️ Tidak ada tabel yang ditemukan. Database mungkin kosong.<br>";
    } else {
        echo "✅ Tabel yang ditemukan:<br>";
        foreach ($tables as $table) {
            echo "- " . $table . "<br>";
        }
    }
    
    // Test mysqli connection
    echo "<h3>Test MySQLi Connection:</h3>";
    $conn = getConnection();
    echo "✅ MySQLi Connection: BERHASIL<br>";
    $conn->close();
    
} catch (PDOException $e) {
    echo "❌ Error PDO: " . $e->getMessage() . "<br>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}
?> 