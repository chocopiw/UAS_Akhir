<?php
header('Content-Type: application/json');
// Pastikan path ini benar sesuai dengan struktur folder Anda
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if(isset($data['action'])) {
            switch($data['action']) {
                case 'login':
                    handleLogin($data);
                    break;
                case 'register':
                    handleRegister($data);
                    break;
                default:
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid action']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Action not specified']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function handleLogin($data) {
    global $pdo;
    
    $email = $data['email'];
    $password = $data['password'];
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email dan password diperlukan']);
        return;
    }

    try {
        // Ubah: Bisa login dengan email atau username
        $stmt = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($user && password_verify($password, $user['password'])) {
            unset($user['password']); // Jangan kirim password hash ke frontend
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Email atau password salah!']);
        }
    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Terjadi kesalahan pada server saat login']);
    }
}

function handleRegister($data) {
    global $pdo;
    
    $username = $data['username'];
    $fullname = $data['fullname'];
    $phone = $data['phone'];
    $email = $data['email'];
    $password = $data['password'];
    $address = $data['address'];
    
    // Validasi input di sisi server
    if (empty($username) || empty($fullname) || empty($phone) || empty($email) || empty($password) || empty($address)) {
        http_response_code(400);
        echo json_encode(['error' => 'Semua bidang registrasi diperlukan!']);
        return;
    }

    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Password minimal 6 karakter']);
        return;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    try {
        // Cek apakah email atau username sudah terdaftar
        $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ? OR username = ?");
        $stmt_check->execute([$email, $username]);
        if ($stmt_check->fetchColumn() > 0) {
            http_response_code(409);
            echo json_encode(['error' => 'Email atau Username sudah terdaftar!']);
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$fullname, $username, $email, $hashed_password, $phone, $address]);
        
        echo json_encode(['success' => true, 'message' => 'Registrasi berhasil! Silakan login.']);
    } catch(PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Registrasi gagal']);
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.log('Login form NOT found');
    }
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}
?> 