// import NewsModel from '../models/news';
const NewsModel = require('../models/news');
class NewsController {
  async getNews(req, res) {
    const { pageSize,pageIndex } = req.query;
    try {
      const total = await NewsModel.countDocuments();
      const news = await NewsModel.find().sort({ _id: -1 }).limit(Number(pageSize)).skip(pageSize*(pageIndex - 1));
      res.send({
        status: true,
        total: total,
        model: news,
      });
    } catch (err) {
      console.log(err);
      res.send({
        status: false,
        message: '获取新闻列表失败',
      });
    }
  }
  async createNews(req, res) {
    const { body } = req;
    try {
      const news = await NewsModel.create(body);
      res.send({
        status: true,
        message: '添加新闻成功',
        model: news,
      });
    } catch (err) {
      console.log(err);
      res.send({
        status: false,
        message: '添加新闻失败，参数错误',
      });
    }
  }
  async deleteNewsById(req, res) {
    const { params } = req;
    try {
      const news = await NewsModel.deleteOne({ _id: params.id });
      res.send({
        status: true,
        message: '删除成功',
        model: news
      });
    } catch (err) {
      res.send({
        status: false,
        message: '删除失败',
      });
    }
  }
  async getNewsById(req, res) {
    const { params } = req;
    try {
      const news = await NewsModel.findById(params.id);
      res.send({
        status: true,
        model: news,
        message: '获取新闻信息成功',
      });
    } catch (err) {
      res.send({
        status: false,
        message: '获取新闻信息失败',
      });
    }
  }
  async editNewsById(req, res) {
    const { params,body } = req;
    try {
      const news = await NewsModel.findByIdAndUpdate(params.id, body);
      res.send({
        status: true,
        model: news,
        message: '更新新闻成功',
      });
    } catch (err) {
      res.send({
        status: false,
        message: '更新新闻失败',
      });
    }
  }
}
module.exports = new NewsController();
