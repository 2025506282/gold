const cheerio = require('cheerio');
const url = 'http://www.dyhjw.com/';
const apiUrls = [
  'http://api.k780.com'
]
const axios = require('axios');
const TimeUtil = require('../../utils/timeUtil');
const params = {
  app: 'finance.shgold_history',
  goldid: 1051,
  date: 20170515,
  appkey: 10003,
  sign: 'b59bc3ef6191eb9f747dd4e83c99f2a4',
  format: 'json'
}
class GoldSpiderController {
  /**
   * 爬取url上的新闻信息
   * @param {根据爬虫url} url
   */
  async getGold(url) {
    const res = await axios.get(url, {params: params});
    if(res.data.success) {
      const gold = res.data.result.lists[0];
      return gold;
    }
  }
  /**
   * 根据爬虫页面的url,返回需要爬虫的详情urls
   * @param {爬虫页面的url} url
   */
  async getGoldDetailUrls(url) {
    const res = await this.getHtml(url);
    const $ = cheerio.load(res.data, { decodeEntities: false });
    let detailUrls = [];
    for (let index = 0; index < $('.eminent_content .eminent_text a').length; index++) {
      detailUrls.push(
        $('.eminent_content .eminent_text a')
          .eq(index)
          .attr('href'),
      );
    }
    return detailUrls;
  }
  /**
   * 根据url获取html文档
   * @param {爬虫url} url
   */
  getHtml(url) {
    return axios.get(url);
  }
}
const goldSC = new GoldSpiderController();
goldSC.getGold(apiUrls[0]);
module.exports = new GoldSpiderController();
