const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件托管
app.use(express.static(path.join(__dirname, 'render')));

// 路由设置
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'render', 'render.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
