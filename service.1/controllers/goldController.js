const GoldModel = require('../models/gold');
class GoldController {
  async getGold(req, res) {
    const { pageSize,pageIndex } = req.query;
    try {
      const total = await GoldModel.countDocuments();
      const gold = await GoldModel.find().sort({ _id: -1 }).limit(Number(pageSize)).skip(pageSize*(pageIndex - 1));
      res.send({
        status: true,
        total: total,
        model: gold,
      });
    } catch (err) {
      console.log(err);
      res.send({
        status: false,
        message: '获取金子列表失败',
      });
    }
  }
  async createGold(req, res) {
    const { body } = req;
    try {
      const gold = await GoldModel.create(body);
      res.send({
        status: true,
        message: '添加金子成功',
        model: gold,
      });
    } catch (err) {
      console.log(err);
      res.send({
        status: false,
        message: '添加金子失败，参数错误',
      });
    }
  }
  async deleteGoldById(req, res) {
    const { params } = req;
    try {
      const gold = await GoldModel.deleteOne({ _id: params.id });
      res.send({
        status: true,
        message: '删除成功',
        model: gold
      });
    } catch (err) {
      res.send({
        status: false,
        message: '删除失败',
      });
    }
  }
  async getGoldById(req, res) {
    const { params } = req;
    try {
      const gold = await GoldModel.findById(params.id);
      res.send({
        status: true,
        model: gold,
        message: '获取金子信息成功',
      });
    } catch (err) {
      res.send({
        status: false,
        message: '获取金子信息失败',
      });
    }
  }
  async editGoldById(req, res) {
    const { params,body } = req;
    try {
      const gold = await GoldModel.findByIdAndUpdate(params.id, body);
      res.send({
        status: true,
        model: gold,
        message: '更新金子成功',
      });
    } catch (err) {
      res.send({
        status: false,
        message: '更新金子失败',
      });
    }
  }
}
module.exports = new GoldController();
