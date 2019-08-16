const cheerio = require("cheerio");
const SpiderController = require('./SpiderController');
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
class GoldSpiderController extends SpiderController {
  constructor() {
    super();
  }
}
module.exports = new GoldSpiderController();
