// server.js
const express = require('express');
const getLaborNews = require('./crawler');

const app = express();
const port = 3000;

app.get('/api/labor-news', async (req, res) => {
  try {
    const news = await getLaborNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: '無法取得新聞' });
  }
});

app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 上運行`);
});
