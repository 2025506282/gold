const express = require("express");
const app = new express();
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const db = require("./mongodb/db");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.use(bodyParser.json());
const origin = "*";
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", origin);
  res.header("Access-Control-Allow-Methods", origin);
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method.toLowerCase() === "options") {
    res.send(200);
  } else {
    next();
  }
});
routes(app);
app.listen(9999, function() {
  console.log("server start at 9999");
});
// io.on("connection", client => {
//   console.log("connection");
//   client.on("event", event => {
//     console.log("event", event);
//   });
//   client.on("disconnect", () => {
//     console.log("disconnect");
//   });
// });
