const cheerio = require('cheerio');
const newsModel = require('../../models/news');
const url = 'http://www.dyhjw.com/';
const SpiderController = require('./spiderController');
const axios = require('axios');
const TimeUtil = require('../../utils/timeUtil');
class NewsSpiderController extends SpiderController {
  constructor() {
    super();
  }
  /***
   * 爬取新闻并且插入
   */
  async spiderNewsAndInsert(req, res) {
    const result = await super.spiderUrls(req, res);
    const newsList = [];
    result.map(elements=>{
      let news = {};
      news['url'] = elements.url;
      elements.elements.map(ele=>{
        news[ele.char] = ele.value;
        if(ele.char === 'publish_time') {
          news[ele.char] = TimeUtil.transTime(ele.value);
        }
      });
      newsList.push(news);
    });
    const newNewsList = await newsModel.create(newsList);
    res.send({
      status: true,
      model: newNewsList,
    });
  } 
}
module.exports = new NewsSpiderController();
