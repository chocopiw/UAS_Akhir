<?php
require_once 'config/database.php';

try {
    // Cek apakah admin sudah ada
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = 'admin' OR email = 'admin@example.com'");
    $stmt->execute();
    $adminExists = $stmt->fetchColumn() > 0;
    
    $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
    if (!$adminExists) {
        // Insert admin user
        $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            'Administrator',
            'admin',
            'admin@example.com',
            $hashedPassword,
            '081234567890',
            'Jl. Admin No. 1'
        ]);
        echo "Admin user berhasil dibuat!\n";
        echo "Username: admin\n";
        echo "Password: admin123\n";
        echo "Email: admin@example.com\n";
    } else {
        // Update password admin ke admin123
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = 'admin' OR email = 'admin@example.com'");
        $stmt->execute([$hashedPassword]);
        echo "Password admin berhasil diupdate ke 'admin123'.\n";
    }
    
    // Tampilkan semua users
    echo "\nDaftar semua users:\n";
    $stmt = $pdo->query("SELECT id, name, username, email FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($users as $user) {
        echo "- ID: {$user['id']}, Name: {$user['name']}, Username: {$user['username']}, Email: {$user['email']}\n";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?> 