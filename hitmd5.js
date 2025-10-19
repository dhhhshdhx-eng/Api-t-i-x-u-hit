const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = 3008;
const API_URL = 'https://jakpotgwab.geightdors.net/glms/v1/notify/taixiu?platform_id=g8&gid=vgmn_101';

let lastResult = null;

function getTaiXiu(d1, d2, d3) {
    return d1 + d2 + d3 <= 10 ? "Xỉu" : "Tài";
}

function generateMd5(data) {
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

async function fetchData() {
    try {
        const response = await axios.get(API_URL);
        const game = response.data?.data?.[0];
        if (game && game.d1 && game.d2 && game.d3) {
            const result = {
                Phien: game.sid,
                Xuc_xac_1: game.d1,
                Xuc_xac_2: game.d2,
                Xuc_xac_3: game.d3,
                Tong: game.d1 + game.d2 + game.d3,
                Ket_qua: getTaiXiu(game.d1, game.d2, game.d3),
                Md5: generateMd5(game)
            };
            lastResult = result;
            console.log(`Cập nhật kết quả mới: ${JSON.stringify(result)}`);
        }
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
    }
}

// Lấy dữ liệu mỗi 5 giây
setInterval(fetchData, 5000);

// Route API
app.get('/api/ditmemayhit', (req, res) => {
    res.json(lastResult || { error: "Đang tải dữ liệu..." });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
    fetchData(); // Lấy dữ liệu ngay khi khởi động
});
