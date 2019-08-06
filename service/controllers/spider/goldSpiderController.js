const cheerio = require("cheerio");
const url = "http://www.dyhjw.com/";
const apiUrls = ["http://api.k780.com"];
const axios = require("axios");
const TimeUtil = require("../../utils/timeUtil");
const params = {
  app: "finance.shgold_history",
  goldid: 1051,
  date: 20170515,
  appkey: 10003,
  sign: "b59bc3ef6191eb9f747dd4e83c99f2a4",
  format: "json"
};
class GoldSpiderController {
  constructor() {
    this.getElements = this.getElements.bind(this);
    this.getHtml = this.getHtml.bind(this);
    this.spiderUrl = this.spiderUrl.bind(this);
    this.spiderUrls = this.spiderUrls.bind(this);
  }

  async spiderUrl(req, res, next) {
    const { url, elements } = req.body;
    const promiseArr = [];
    promiseArr.push(this.getElements(url, elements, true));
    const result = await Promise.all(promiseArr);
    res.send({
      status: true,
      model: {
        origin: url,
        result
      }
    });
  }
  async spiderUrls(req, res, next) {
    const { urls, elements } = req.body;
    const promiseArr = [];
    urls.map((url) => {
      promiseArr.push(this.getElements(url, elements));
    });
    const result = await Promise.all(promiseArr);
    res.send(result);
  }
  /**
   * 爬取页面上元素信息
   * @param {根据爬虫url} url
   */
  async getElements(url, elements, isHref) {
    const res = await this.getHtml(url);
    const $ = cheerio.load(res.data, { decodeEntities: false });
    elements.map(element=> {
      if(isHref) {
        let hrefs = [];
        $(element.selector).map(function(){
          hrefs.push($(this).attr('href'));
        })
        element.value = hrefs;
      } else {
        element.value = $(element.selector).html();
      }
    })
    return elements;
  }
  /**
   * 根据url获取html文档
   * @param {爬虫url} url
   */
  async getHtml(url) {
    return axios.get(url);
  }
}
// const goldSC = new GoldSpiderController();
// goldSC.getGold(apiUrls[0]);
module.exports = new GoldSpiderController();
