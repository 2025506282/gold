const user = require('./user');
const news = require('./news');
const spider = require('./spider');
const mail = require('./mail');
const config = require('./config');
module.exports = (app) => {
  app.use('/users',user);
  app.use('/news',news);
  app.use('/mail',mail);
  app.use('/spider',spider);
  app.use('/config',config);
}
