const express = require("express");

const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const port = 3002;
const { Server } = require("socket.io");
const io = new Server(server);

const ejs = require("ejs");
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

io.on('connection', (socket,req,res) => {
  console.log("connection");
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});
var routes = require('./routes/index');  //

app.use(express.static("public"));
// app.set("src", "path/to/views");
app.set('views', path.join(__dirname, 'views'));
app.use('/', routes);
/////////////////////////////////////////
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function getCurTimestamp() {
  const d = new Date();

  return new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    )
  ).toISOString().replace('T','_').replace('Z','');
}


server.listen(port, () => {
  console.log(port, " port server running");
});
