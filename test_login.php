<?php
// Test login dengan kredensial admin
$testData = [
    'action' => 'login',
    'email' => 'admin',
    'password' => 'admin123'
];

$jsonData = json_encode($testData);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $jsonData
    ]
]);

$response = file_get_contents('http://localhost/UAS_Akhir/api/auth.php', false, $context);

echo "Response dari API:\n";
echo $response . "\n";

// Test dengan curl jika tersedia
if (function_exists('curl_init')) {
    echo "\nTesting dengan cURL:\n";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/UAS_Akhir/api/auth.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $curlResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Code: " . $httpCode . "\n";
    echo "cURL Response: " . $curlResponse . "\n";
}
?> 