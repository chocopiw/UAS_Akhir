-- Membuat database
CREATE DATABASE IF NOT EXISTS uas_akhir;
USE uas_akhir;

-- Membuat tabel users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT
);

-- Membuat tabel products
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category VARCHAR(100),
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Membuat tabel pelayanan
CREATE TABLE IF NOT EXISTS pelayanan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_pelayanan VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(10,2) NOT NULL,
    durasi INT DEFAULT 30 COMMENT 'Durasi dalam menit',
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Membuat tabel pesanan pelayanan
CREATE TABLE IF NOT EXISTS pesanan_pelayanan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    pelayanan_id INT NOT NULL,
    tanggal_pesanan DATE NOT NULL,
    waktu_pesanan TIME NOT NULL,
    status ENUM('pending', 'dikonfirmasi', 'dalam_proses', 'selesai', 'dibatalkan') DEFAULT 'pending',
    catatan TEXT,
    total_harga DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pelayanan_id) REFERENCES pelayanan(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert data sample untuk pelayanan
INSERT INTO pelayanan (nama_pelayanan, deskripsi, harga, durasi) VALUES
('Konsultasi Kopi', 'Konsultasi tentang jenis kopi dan cara penyeduhan yang tepat', 50000.00, 60),
('Barista Training', 'Pelatihan dasar menjadi barista profesional', 150000.00, 120),
('Coffee Cupping', 'Sesi cupping untuk mengevaluasi kualitas kopi', 75000.00, 90),
('Workshop Roasting', 'Workshop tentang teknik roasting kopi', 200000.00, 180),
('Coffee Tasting', 'Sesi mencicipi berbagai jenis kopi premium', 100000.00, 60); 