// bot.js
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const getLaborNews = require('./crawler');

const token = process.env.TELEGRAM_BOT_TOKEN;  // 使用環境變數
const bot = new TelegramBot(token, { polling: true });

bot.onText(/勞動部/, async (msg) => {
  const chatId = msg.chat.id;
  const news = await getLaborNews();

  if (news.length === 0) {
    bot.sendMessage(chatId, '目前無法取得勞動部新聞，請稍後再試。');
  } else {
    const maxItems = 3; // 控制顯示的最大新聞數量
    let newsMessage = '勞動部最新新聞：\n';
    news.slice(0, maxItems).forEach((item, index) => {
      newsMessage += `${index + 1}. ${item.title}\n${item.link}\n\n`;
    });
    bot.sendMessage(chatId, newsMessage);
  }
});
