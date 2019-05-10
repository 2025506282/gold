const express = require('express');
const app = new express();
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const db = require('./mongodb/db');
app.use(bodyParser.json())
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  if (req.method.toLowerCase() === 'options') {
    res.send(200);
  } else {
    next();
  }
});
routes(app);
app.listen(9999,function(){
  console.log('server start at 9999');
})
