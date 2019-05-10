const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  password: String,
  create_time: { type: Date, default: Date.now },
  age: Number,
  address: String,
})
const User = mongoose.model('User',userSchema);
module.exports = User;
