const user = require('./user');
const news = require('./news');
module.exports = (app) => {
  app.use('/users',user);
  app.use('/news',news);
}
