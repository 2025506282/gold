const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const newsSchema = new Schema({
  origin: String,
  url: String,
  title: String,
  abstract: String,
  publish_time: { type: Number },
  author: String,
  agenda: String,
  content: String,
  like: { type: Number, default: 0},
  collected: { type: Number, default: 0},
  dislike: { type: Number, default: 0},
  collect: { type: Number, default: 0},
  isDelete: { type: Boolean, default: false },
  create_time: { type: Number, default: new Date().getTime() },
  update_time: { type: Number, default: new Date().getTime() },
})
const News = mongoose.model('News', newsSchema);
module.exports = News;
