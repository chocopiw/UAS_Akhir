<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../config/database.php';

header('Content-Type: application/json');

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = getConnection();

// GET - Fetch all products or single product
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_assoc());
    } else {
        $result = $conn->query("SELECT * FROM products ORDER BY id DESC");
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        echo json_encode($products);
    }
}

// POST - Create new product
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $price = $_POST['price'];
    $stock = $_POST['stock'] ?? 0;
    $category = $_POST['category'] ?? '';
    $description = $_POST['description'] ?? '';
    $image = '';

    // Handle image upload
    if (isset($_FILES['image'])) {
        $file = $_FILES['image'];
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'produk_' . uniqid() . '.' . $ext;
        $uploadPath = '../uploads/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $image = 'uploads/' . $filename;
        }
    }

    $stmt = $conn->prepare("INSERT INTO products (name, price, stock, category, description, image) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => $conn->error]);
        exit;
    }
    $stmt->bind_param("sdssss", $name, $price, $stock, $category, $description, $image);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

// PUT - Update product
else if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_POST['_method'] === 'PUT') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $price = $_POST['price'];
    $stock = $_POST['stock'] ?? 0;
    $category = $_POST['category'] ?? '';
    $description = $_POST['description'] ?? '';
    
    $updateFields = [];
    $types = "";
    $values = [];

    // Update basic info
    $updateFields[] = "name = ?";
    $updateFields[] = "price = ?";
    $updateFields[] = "stock = ?";
    $updateFields[] = "category = ?";
    $updateFields[] = "description = ?";
    $types .= "sdsss";
    $values[] = $name;
    $values[] = $price;
    $values[] = $stock;
    $values[] = $category;
    $values[] = $description;

    // Handle image upload if new image is provided
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $file = $_FILES['image'];
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'produk_' . uniqid() . '.' . $ext;
        $uploadPath = '../uploads/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $updateFields[] = "image = ?";
            $types .= "s";
            $values[] = 'uploads/' . $filename;

            // Delete old image
            $stmt = $conn->prepare("SELECT image FROM products WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($oldImage = $result->fetch_assoc()) {
                if (file_exists('../' . $oldImage['image'])) {
                    unlink('../' . $oldImage['image']);
                }
            }
        }
    }

    // Add id to values array
    $types .= "i";
    $values[] = $id;

    $sql = "UPDATE products SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

// DELETE - Delete product
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];

    // Get image path before deleting
    $stmt = $conn->prepare("SELECT image FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($product = $result->fetch_assoc()) {
        // Delete the image file
        if (!empty($product['image']) && file_exists('../' . $product['image'])) {
            unlink('../' . $product['image']);
        }
    }

    // Delete the product
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

$conn->close(); 