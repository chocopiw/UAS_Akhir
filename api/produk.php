<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$uploads_dir = __DIR__ . '/../uploads';
if (!file_exists($uploads_dir)) {
    mkdir($uploads_dir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Ambil semua produk
    $stmt = $pdo->query('SELECT * FROM produk ORDER BY id DESC');
    $produk = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $produk]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = $_POST['nama'] ?? '';
    $harga = $_POST['harga'] ?? '';
    $deskripsi = $_POST['deskripsi'] ?? '';
    $kategori = $_POST['kategori'] ?? '';
    $gambar = '';

    // Validasi field
    if (!$nama || !$harga || !$kategori) {
        echo json_encode(['success' => false, 'message' => 'Field wajib diisi!']);
        exit;
    }

    // Upload gambar
    if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($_FILES['gambar']['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($ext, $allowed)) {
            echo json_encode(['success' => false, 'message' => 'Format gambar tidak didukung!']);
            exit;
        }
        $newName = uniqid('produk_', true) . '.' . $ext;
        $target = $uploads_dir . '/' . $newName;
        if (!move_uploaded_file($_FILES['gambar']['tmp_name'], $target)) {
            echo json_encode(['success' => false, 'message' => 'Gagal upload gambar!']);
            exit;
        }
        $gambar = $newName;
    }

    // Simpan ke database
    $stmt = $pdo->prepare('INSERT INTO produk (nama, harga, deskripsi, gambar, kategori) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$nama, $harga, $deskripsi, $gambar, $kategori]);
    echo json_encode(['success' => true, 'message' => 'Produk berhasil ditambahkan!']);
    exit;
}

// Method tidak didukung
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']); 