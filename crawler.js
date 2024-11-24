// crawler.js
const axios = require('axios');
const cheerio = require('cheerio');

async function getLaborNews() {
  try {
    const response = await axios.get('https://www.mol.gov.tw/1607/1632/1640/');
    const html = response.data;
    const $ = cheerio.load(html);
    const newsList = [];

    // 選取包含新聞資訊的 .item_listblock，然後查找其中的 .item_list2 > h3 > a
    $('.item_listblock').each((index, element) => {
      const titleElement = $(element).find('.item_list2 h3 a');
      const title = titleElement.text().trim();
      const link = 'https://www.mol.gov.tw' + titleElement.attr('href');

      if (title && link) {
        newsList.push({ title, link });
      }
    });

    console.log('爬取到的所有新聞數量:', newsList.length); // 檢查爬取的新聞數量
    return newsList;
  } catch (error) {
    console.error('爬取新聞時出錯:', error);
    return [];
  }
}

module.exports = getLaborNews;
