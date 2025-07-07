<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        handlePost();
        break;
    case 'PUT':
        handlePut();
        break;
    case 'DELETE':
        handleDelete();
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function handleGet() {
    global $pdo;
    
    if (isset($_GET['id'])) {
        // Get single pelayanan
        $id = $_GET['id'];
        $stmt = $pdo->prepare("SELECT * FROM pelayanan WHERE id = ?");
        $stmt->execute([$id]);
        $pelayanan = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($pelayanan) {
            echo json_encode(['success' => true, 'data' => $pelayanan]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Pelayanan tidak ditemukan']);
        }
    } else {
        // Get all pelayanan
        $stmt = $pdo->query("SELECT * FROM pelayanan ORDER BY created_at DESC");
        $pelayanan = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $pelayanan]);
    }
}

function handlePost() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['action'])) {
        echo json_encode(['success' => false, 'message' => 'Action tidak ditemukan']);
        return;
    }
    
    switch ($input['action']) {
        case 'create':
            createPelayanan($input);
            break;
        case 'pesan':
            pesanPelayanan($input);
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Action tidak valid']);
            break;
    }
}

function handlePut() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
        return;
    }
    
    updatePelayanan($input);
}

function handleDelete() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
        return;
    }
    
    deletePelayanan($input['id']);
}

function createPelayanan($data) {
    global $pdo;
    
    if (!isset($data['nama_pelayanan']) || !isset($data['harga'])) {
        echo json_encode(['success' => false, 'message' => 'Nama pelayanan dan harga harus diisi']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO pelayanan (nama_pelayanan, deskripsi, harga, durasi, status) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['nama_pelayanan'],
            $data['deskripsi'] ?? '',
            $data['harga'],
            $data['durasi'] ?? 30,
            $data['status'] ?? 'aktif'
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Pelayanan berhasil ditambahkan']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Gagal menambahkan pelayanan: ' . $e->getMessage()]);
    }
}

function updatePelayanan($data) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("UPDATE pelayanan SET nama_pelayanan = ?, deskripsi = ?, harga = ?, durasi = ?, status = ? WHERE id = ?");
        $stmt->execute([
            $data['nama_pelayanan'],
            $data['deskripsi'] ?? '',
            $data['harga'],
            $data['durasi'] ?? 30,
            $data['status'] ?? 'aktif',
            $data['id']
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Pelayanan berhasil diperbarui']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Gagal memperbarui pelayanan: ' . $e->getMessage()]);
    }
}

function deletePelayanan($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("DELETE FROM pelayanan WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Pelayanan berhasil dihapus']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Pelayanan tidak ditemukan']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus pelayanan: ' . $e->getMessage()]);
    }
}

function pesanPelayanan($data) {
    global $pdo;
    
    if (!isset($data['user_id']) || !isset($data['pelayanan_id']) || !isset($data['tanggal_pesanan']) || !isset($data['waktu_pesanan'])) {
        echo json_encode(['success' => false, 'message' => 'Data pesanan tidak lengkap']);
        return;
    }
    
    try {
        // Get harga pelayanan
        $stmt = $pdo->prepare("SELECT harga FROM pelayanan WHERE id = ?");
        $stmt->execute([$data['pelayanan_id']]);
        $pelayanan = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$pelayanan) {
            echo json_encode(['success' => false, 'message' => 'Pelayanan tidak ditemukan']);
            return;
        }
        
        $total_harga = $pelayanan['harga'];
        
        $stmt = $pdo->prepare("INSERT INTO pesanan_pelayanan (user_id, pelayanan_id, tanggal_pesanan, waktu_pesanan, catatan, total_harga) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['user_id'],
            $data['pelayanan_id'],
            $data['tanggal_pesanan'],
            $data['waktu_pesanan'],
            $data['catatan'] ?? '',
            $total_harga
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Pesanan pelayanan berhasil dibuat']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Gagal membuat pesanan: ' . $e->getMessage()]);
    }
}
?> 