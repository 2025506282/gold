const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  telephone: Number,
  code: String,
  email: String,
  head_image: String,
  create_time: { type: Number, default: new Date().getTime() },
  company: String,
  presentation: String,
  host: String,
  position: String,
  birthday: Number,
  address: String,
})
const User = mongoose.model('User',userSchema);
module.exports = User;
