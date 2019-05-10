const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const goldSchema = new Schema({
  "gold_id": String,
  "varity": String,
  "varietynm": String,
  "days": Date,
  "last_price": Number,
  "high_price": Number,
  "low_price": Number,
  "open_price": Number,
  "yesy_price": Number
})
const Gold = mongoose.model('Gold',goldSchema);
module.exports = Gold;
