// import UserModel from '../models/user';
const UserModel = require('../models/user');
const NumberUtil = require('../utils/numberUtil');
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
      const findOne = await UserModel.findOne({email: body.email});
      if(findOne) {
        res.send({
          status: false,
          message: '邮箱已经被注册',
          model: null,
        });
      } else {
        const user = await UserModel.create(body);
        delete user.password;
        res.send({
          status: true,
          message: '添加用户成功',
          model: user,
        });
      }
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
        message: '登录成功',
      });
    } catch (err) {
      res.send({
        status: false,
        message: '登录失败',
      });
    }
  }
  async login(req, res) {
    const { body } = req;
    if(body.hasOwnProperty('remember')) {
      delete body.remember;
    }
    try {
      const user = await UserModel.findOne(body);
      delete user.password;
      if(user) {
        res.send({
          status: true,
          model: user,
          message: '获取用户信息成功',
        });
      } else {
        res.send({
          status: false,
          model: null,
          message: '查不到该用户信息',
        });
      }
    } catch (err) {
      res.send({
        status: false,
        message: '获取用户信息失败',
      });
    }
  }
  async updateCode(email, code) {
    try {
      await UserModel.findOneAndUpdate(email, {
        code,
      });
    } catch (err) {
      throw {
        code: '更新code失败'
      }
    }
  }
  async editPassword(req, res) {
    const { body } = req;
    const code = NumberUtil.createFourNumber();
    try {
      const user = await UserModel.findOneAndUpdate(body.id, body);
      // delete user.password;
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
  async editUserById(req, res) {
    const { body } = req;
    try {
      const user = await UserModel.findByIdAndUpdate(body.id, body);
      delete user.password;
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
