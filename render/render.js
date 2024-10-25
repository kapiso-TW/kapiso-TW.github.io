// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// 設定密碼 (您可以更改這裡的密碼)
const PASSWORD = "123";

// 用於解析 JSON 和表單數據
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 靜態文件夾（前端 HTML 文件存放的地方）
app.use(express.static('render'));

// 密碼驗證路由
app.post('/login', (req, res) => {
    const { password } = req.body;
    
    // 驗證密碼
    if (password === PASSWORD) {
        res.send("密碼正確！歡迎進入網站。");
    } else {
        res.status(401).send("密碼錯誤，請重新嘗試。");
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
 