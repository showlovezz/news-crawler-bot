// crawler.js
const axios = require('axios');
const cheerio = require('cheerio');

async function getLaborNews() {
  try {
    const response = await axios.get('https://www.mol.gov.tw/1607/1632/1640/');
    const html = response.data;
    const $ = cheerio.load(html);
    const newsList = [];

    // 選取包含新聞資訊的元素
    $('.item_listblock').each((index, element) => {
      const title = $(element).find('.item_list2 a').text().trim();
      const link = 'https://www.mol.gov.tw' + $(element).find('.item_list2 a').attr('href');
      
      if (title && link) {
        newsList.push({ title, link });
      }
    });

    return newsList;
  } catch (error) {
    console.error('爬取新聞時出錯:', error);
    return [];
  }
}

module.exports = getLaborNews;
