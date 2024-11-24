// bot.js
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const getLaborNews = require('./crawler');
const axios = require('axios');
const moment = require('moment');

// 使用環境變數
const token = process.env.TELEGRAM_BOT_TOKEN;  
const newsApiKey = process.env.NEWS_API_KEY;
const bot = new TelegramBot(token, { polling: true });

// 當用戶輸入任何文本時
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const keyword = msg.text.trim();

  if (!keyword) {
    bot.sendMessage(chatId, '請輸入關鍵字以獲取新聞。');
    return;
  }

  try {
    let collectedArticles = [];
    // 從當天開始查詢
    let currentDate = moment();
    // 需要的新聞數量
    const maxItems = 5;          

    while (collectedArticles.length < maxItems) {
      const dateString = currentDate.format('YYYY-MM-DD');

      // 查詢當天的新聞
      const response = await axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: keyword,
          from: dateString,
          to: dateString,
          language: 'zh',
          sortBy: 'publishedAt',
          apiKey: newsApiKey,
        },
      });

      const articles = response.data.articles;

      // 篩選出標題、描述或內容中包含關鍵字的新聞
      articles.forEach((article) => {
        if (
          (article.title && article.title.includes(keyword)) ||
          (article.description && article.description.includes(keyword)) ||
          (article.content && article.content.includes(keyword))
        ) {
          collectedArticles.push(article);
        }
      });

      // 如果已經達到需要的數量，停止查詢
      if (collectedArticles.length >= maxItems) {
        break;
      }

      // 如果當天的新聞不夠，繼續往前一天查詢
      currentDate.subtract(1, 'days');
    }

    // 截取最新的 5 筆新聞
    const articlesToShow = collectedArticles.slice(0, maxItems);

    if (articlesToShow.length === 0) {
      bot.sendMessage(chatId, `找不到與 "${keyword}" 相關的新聞。`);
    } else {
      let newsMessage = `與 "${keyword}" 相關的最新新聞：\n\n`;
      articlesToShow.forEach((article, index) => {
        newsMessage += `${index + 1}. ${article.title}\n${article.url}\n\n`;
      });
      bot.sendMessage(chatId, newsMessage);
    }
  } catch (error) {
    console.error('查詢新聞時出錯:', error);
    bot.sendMessage(chatId, '查詢新聞時發生錯誤，請稍後再試。');
  }
});
