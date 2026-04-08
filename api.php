<?php
// api.php - บุรุษไปรษณีย์รับส่งคำอวยพร
$file = 'blessings.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // รับข้อมูลใหม่
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {
        $current_data = json_decode(file_exists($file) ? file_get_contents($file) : '[]', true);
        $current_data[] = [
            'name' => htmlspecialchars($input['name']),
            'bless' => htmlspecialchars($input['bless']),
            'type' => htmlspecialchars($input['type']),
            'time' => time()
        ];
        // เก็บแค่ 100 ข้อความล่าสุด
        if (count($current_data) > 100) array_shift($current_data);
        file_put_contents($file, json_encode($current_data));
        echo json_encode(['status' => 'success']);
    }
} else {
    // ส่งข้อมูลออกไปโชว์ที่หน้าจอ
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo '[]';
    }
}
?>
