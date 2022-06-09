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

/////////////////////////////////////////
var db_config = require(__dirname + '/database.js');// 2020-09-13
var sync_mysql = require('sync-mysql'); //2020-01-28
let sync_connection = new sync_mysql(db_config.constr());
let krw_price = "0";
let btc_price = "0";
let eth_price = "0";
async function getPrice(){
  let result_KRW = sync_connection.query("SELECT krw,BTC,BTC_KRW,ETH,ETH_KRW FROM show_krw where idx=1");
  krw_price = result_KRW[0].krw;
  btc_price = result_KRW[0].BTC;
  eth_price = result_KRW[0].ETH;
}
getPrice();
let _conCnt=0;
/////////////////////////////////////////
io.on('connection', (socket,req,res) => {
  _conCnt=_conCnt+1;
  console.log("connection : "+ _conCnt + " : " + getCurTimestamp());
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  //* 클라이언트로 메세지 보내기
  socket.interval = setInterval(() => {
    getPrice();
    // 15초마다 클라이언트로 메시지 전송
    io.emit('msg_btc_price', btc_price);
    io.emit('msg_eth_price', eth_price);
    // console.log(btc_price + ": "+getCurTimestamp());
    }, 15000);

  socket.on('disconnect', function() {
    // console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnect");
    _conCnt=_conCnt-1;
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
