const cheerio = require('cheerio');
const goldController = require('../goldController');
const apiUrls = [
  'http://api.k780.com'
]
const GoldModel = require('../../models/gold');
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
   * 根据接口获取gold信息
   * @param {接口url} url
   */
  async getGold(url) {
    const res = await axios.get(url, {params: params});
    if (res.data && Number(res.data.success)) {
      console.log(res.data)
      const gold = res.data.result.lists[0];
      return gold;
    } else {
      console.log(res.data.msg);
      return false;
    }
  }
  /**
   * 根据传入的参数gold,创建gold信息
   * @param {传入的参数gold} gold
   */
  async createGold(gold) {
    try {
      const newGold = await GoldModel.create(gold);
      return {
        status: true,
        message: '添加金子成功',
        model: newGold
      };
    } catch (err) {
      console.log(err);
      return {
        status: false,
        message: '添加金子失败，参数错误',
      };
    }
  }
  /**
   * 根据url获取html文档
   * @param {爬虫url} url
   */
  getHtml(url) {
    return axios.get(url);
  }
}
module.exports =  GoldSpiderController;
