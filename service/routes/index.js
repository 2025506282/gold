const user = require('./user');
const news = require('./news');
const spider = require('./spider');
module.exports = (app) => {
  app.use('/users',user);
  app.use('/news',news);
  app.use('/spider',spider);
}
