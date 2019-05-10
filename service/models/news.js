const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const newsSchema = new Schema({
  title: String,
  abstract: String,
  publish_time: { type: Date },
  author: String,
  agenda: String,
  content: String,
  love: { type: Number, default: 0},
  collect: { type: Number, default: 0},
  isDelete: { type: Boolean, default: false },
  create_time: { type: Date, default: Date.now },
  update_time: { type: Date, default: Date.now },
})
const News = mongoose.model('News', newsSchema);
module.exports = News;
