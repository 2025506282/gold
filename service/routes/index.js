const user = require('./user');
const news = require('./news');
const spider = require('./spider');
const config = require('./config');
module.exports = (app) => {
  app.use('/users',user);
  app.use('/news',news);
  app.use('/spider',spider);
  app.use('/config',config);
}
