const cheerio = require("cheerio");
const axios = require("axios");
class SpiderController {
  constructor() {
    // this.getElements = this.getElements.bind(this);
    // this.getHtml = this.getHtml.bind(this);
    this.spiderUrl = this.spiderUrl.bind(this);
    this.spiderUrls = this.spiderUrls.bind(this);
  }
  
  /**
   * 爬取单个url
   */
  async spiderUrl(req, res, next) {
    const { url, elements } = req.body;
    const newElements = await SpiderController.getElements(url, elements, true)
    res.send({
      status: true,
      model: {
        origin: url,
        element: newElements[0]
      }
    });
  }
  /**
   * 爬取多个url
   */
  async spiderUrls(req, res, next) {
    const { urls, elements } = req.body;
    const result = [];
    for (let index = 0; index < urls.length; index++) {
      const newElements = await SpiderController.getElements(urls[index], JSON.parse(JSON.stringify(elements)));
      let item = {};
      item['url'] = urls[index];
      item['elements'] = newElements;
      result.push(item);
    }
    return result;
  }
  /**
   * 爬取页面上元素信息
   * @param {根据爬虫url} url
   */
  static async  getElements(url, elements, isHref) {
    const res = await SpiderController.getHtml(url);
    const $ = cheerio.load(res.data, { decodeEntities: false });
    elements.map(element => {
      if (isHref) {
        let hrefs = [];
        $(element.selector).map(function () {
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
  static async  getHtml(url) {
    return axios.get(url);
  }
}
module.exports = SpiderController;
