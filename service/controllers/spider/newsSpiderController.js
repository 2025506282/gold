const cheerio = require('cheerio');
const url = 'http://www.dyhjw.com/';
const axios = require('axios');
const TimeUtil = require('../../utils/timeUtil');
class NewsSpiderController {
  /**
   * 爬取url上的新闻信息
   * @param {根据爬虫url} url
   */
  async getNews(url) {
    const news = {
      abstract: null,
      title: null,
      author: null,
      content: null,
    };
    const res = await this.getHtml(url);
    const $ = cheerio.load(res.data, { decodeEntities: false });
    news.abstract = $('.zhaiyao_word').text();
    news.title = $('.zbt').text();
    news.author = $('.zrbj').text();
    news.content = $('.section_wrap').html();
    news.publish_time = new Date(TimeUtil.transTime($('#pushtime').text()));
    return news;
  }
  /**
   * 根据爬虫页面的url,返回需要爬虫的详情urls
   * @param {爬虫页面的url} url
   */
  async getNewsDetailUrls(url) {
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
module.exports = new NewsSpiderController();
