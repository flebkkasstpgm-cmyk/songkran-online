# Jarvis_Minion.ps1 - สคริปต์รับคำสั่งสิงร่าง (รันที่เครื่อง Windows 8.1)
$masterUrl = "http://10.0.4.102/songkran/api_possess.php"
$lastCmdId = 0

Write-Host "🤖 JARVIS: ร่างทรงพร้อมทำงานบน Windows 8.1 แล้วครับเจ้านาย..." -ForegroundColor Cyan
Write-Host "🛰️ กำลังเชื่อมต่อกับศูนย์บัญชาการที่ $masterUrl"

while($true) {
    try {
        # ดึงคำสั่งจาก Master
        $response = Invoke-RestMethod -Uri $masterUrl -Method Get
        
        if ($response.id -gt $lastCmdId) {
            $cmd = $response.cmd
            $lastCmdId = $response.id
            
            if ($cmd -ne "wait") {
                Write-Host "[$(Get-Date -Format 'HH:i:s')] ⚡ ได้รับคำสั่ง: $cmd" -ForegroundColor Yellow
                
                # ประมวลผลคำสั่ง
                if ($cmd -eq "hello") {
                    [System.Windows.Forms.MessageBox]::Show("สวัสดีครับเจ้านาย! จาวิชมาสิงร่างเครื่องนี้แล้วครับ!", "JARVIS System")
                } elseif ($cmd -eq "info") {
                    $info = "OS: Windows 8.1 | User: $env:USERNAME | IP: $(hostname)"
                    Write-Host "📊 ส่งรายงานกลับ: $info"
                    Invoke-RestMethod -Uri $masterUrl -Method Post -Body (ConvertFrom-Json "{'minion_report':'$info'}") -ContentType "application/json"
                } else {
                    # รันคำสั่ง Shell ทั่วไป
                    Invoke-Expression $cmd
                }
            }
        }
    } catch {
        # เงียบไว้เมื่อติดต่อไม่ได้
    }
    
    Start-Sleep -Seconds 2
}
