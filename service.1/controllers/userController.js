// import UserModel from '../models/user';
const UserModel = require('../models/user');
class UserController {
  async getUsers(req, res) {
    const { pageSize,pageIndex } = req.query;
    try {
      const total = await UserModel.countDocuments();
      const users = await UserModel.find().sort({ _id: -1 }).limit(Number(pageSize)).skip(pageSize*(pageIndex - 1));
      res.send({
        status: true,
        total: total,
        model: users,
      });
    } catch (err) {
      console.log(err);
      res.send({
        status: false,
        message: '获取用户列表失败',
      });
    }
  }
  async createUser(req, res) {
    const { body } = req;
    try {
      const user = await UserModel.create(body);
      res.send({
        status: true,
        message: '添加用户成功',
        model: user,
      });
    } catch (err) {
      console.log(err);
      res.send({
        status: false,
        message: '添加用户失败，参数错误',
      });
    }
  }
  async deleteUserById(req, res) {
    const { params } = req;
    try {
      const user = await UserModel.deleteOne({ _id: params.id });
      res.send({
        status: true,
        message: '删除成功',
      });
    } catch (err) {
      res.send({
        status: false,
        message: '删除失败',
      });
    }
  }
  async getUserById(req, res) {
    const { params } = req;
    try {
      const user = await UserModel.findById(params.id);
      res.send({
        status: true,
        model: user,
        message: '获取用户信息成功',
      });
    } catch (err) {
      res.send({
        status: false,
        message: '获取用户信息失败',
      });
    }
  }
  async editUserById(req, res) {
    const { params,body } = req;
    try {
      const user = await UserModel.findByIdAndUpdate(params.id, body);
      res.send({
        status: true,
        model: user,
        message: '更新用户成功',
      });
    } catch (err) {
      res.send({
        status: false,
        message: '更新用户失败',
      });
    }
  }
}
module.exports = new UserController();
// export default new UserController()
