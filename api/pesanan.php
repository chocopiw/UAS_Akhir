<?php
header('Content-Type: application/json');

// Dummy data pesanan (bisa diganti query database)
$pesanan = [
    [
        'id' => 1,
        'nama_customer' => 'ujang',
        'produk' => 'V60 Dripper Keramik',
        'jumlah' => 1,
        'total_harga' => 95000,
        'status' => 'Selesai',
        'tanggal' => '2025-07-07',
    ],
    [
        'id' => 2,
        'nama_customer' => 'ujang',
        'produk' => 'Biji Kopi Gayo',
        'jumlah' => 1,
        'total_harga' => 85000,
        'status' => 'Proses',
        'tanggal' => '2025-07-07',
    ],
    [
        'id' => 3,
        'nama_customer' => 'ujang',
        'produk' => 'Syphon Coffee Maker Manual Brew Vacuum Pot',
        'jumlah' => 1,
        'total_harga' => 150000,
        'status' => 'Proses',
        'tanggal' => '2025-07-07',
    ],
    [
        'id' => 4,
        'nama_customer' => 'ujang',
        'produk' => 'Syphon Coffee Maker Manual Brew Vacuum Pot',
        'jumlah' => 1,
        'total_harga' => 150000,
        'status' => 'Selesai',
        'tanggal' => '2025-07-01',
    ],
    [
        'id' => 5,
        'nama_customer' => 'ujang',
        'produk' => 'Syphon Coffee Maker Manual Brew Vacuum Pot',
        'jumlah' => 1,
        'total_harga' => 150000,
        'status' => 'Proses',
        'tanggal' => '2025-06-26',
    ],
    [
        'id' => 6,
        'nama_customer' => 'User Biasa',
        'produk' => 'V60 Dripper Keramik',
        'jumlah' => 1,
        'total_harga' => 95000,
        'status' => 'Proses',
        'tanggal' => '2025-06-26',
    ],
    [
        'id' => 7,
        'nama_customer' => 'User Biasa',
        'produk' => 'Biji Kopi Gayo',
        'jumlah' => 1,
        'total_harga' => 85000,
        'status' => 'Selesai',
        'tanggal' => '2025-06-26',
    ],
];

echo json_encode(['data' => $pesanan]); 