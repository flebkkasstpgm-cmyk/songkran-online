const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, 'blessings.json');

app.use(express.json());
app.use(express.static(__dirname)); // รับใช้ไฟล์ index.html, style.css, script.js อัตโนมัติ

// API รับคำอวยพร
app.post('/api/bless', (req, res) => {
    const newBless = { ...req.body, time: Date.now() };
    let data = [];
    if (fs.existsSync(DATA_FILE)) {
        data = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    data.push(newBless);
    if (data.length > 100) data.shift(); // เก็บแค่ 100 อันล่าสุด
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ status: 'success' });
});

// API ดึงคำอวยพร
app.get('/api/bless', (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
        res.json(JSON.parse(fs.readFileSync(DATA_FILE)));
    } else {
        res.json([]);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 JARVIS Songkran Board is running!`);
    console.log(`👉 Local: http://localhost:${PORT}`);
    console.log(`👉 Network: http://10.0.4.102:${PORT}\n`);
    console.log(`เจ้านายเปิดหน้าเว็บตามลิงก์ด้านบนได้เลยครับ!`);
});
