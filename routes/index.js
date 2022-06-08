var express = require('express');
var router = express.Router();

// npm i sync-mysql
var db_config = require(__dirname + '/database.js');// 2020-09-13
var sync_mysql = require('sync-mysql'); //2020-01-28
let sync_connection = new sync_mysql(db_config.constr());

const whaleTrInfo = {
  blockchain : '',symbol : '',id : '',transaction_type : '',hash : '',from_address : '',from_owner_type : '',
  to_address : '',to_owner_type : '',timestamp : '',amount : '',amount_usd : '',transaction_count : '',regdate : ''
}

function getwhaleTrInfo(){
  let result = sync_connection.query("select blockchain,symbol,id,transaction_type,hash,from_address,from_owner_type,to_address,to_owner_type,timestamp,amount,amount_usd,transaction_count,regdate from whaleTr ORDER by id desc LIMIT 1");
  try{
    whaleTrInfo.blockchain      = result[0].blockchain;
    whaleTrInfo.symbol          = result[0].symbol;
    whaleTrInfo.id              = result[0].id;
    whaleTrInfo.transaction_type = result[0].transaction_type;
    whaleTrInfo.hash            = result[0].hash;
    whaleTrInfo.from_address    = result[0].from_address;
    whaleTrInfo.from_owner_type = result[0].from_owner_type;
    whaleTrInfo.to_address      = result[0].to_address;
    whaleTrInfo.to_owner_type   = result[0].to_owner_type;
    whaleTrInfo.timestamp       = result[0].timestamp;
    whaleTrInfo.amount          = result[0].amount;
    whaleTrInfo.amount_usd      = result[0].amount_usd;
    whaleTrInfo.transaction_count = result[0].transaction_count;
    whaleTrInfo.regdate         = result[0].regdate;
  } catch(e) {
    console.log("no data");
  }
  return whaleTrInfo;
}

const mainInfo = {
	f1 : '',
	f2 : '',
	f3 : '',
	f4 : '',
	f5 : '',
	f6 : '',
	f7 : '',
	f8 : '',
	f9 : '',
	f10 : '',
	f11 : '',
	f12 : '',
	f13 : '',
	f14_1 : '',
	f14_2 : '',
	f15_1 : '',
	f15_2 : '',
	f16_1 : '',
	f16_2 : ''
  // print : function(){ console.log('user_email : ' + user_email + '); }
}

function getmainInfo(){
  let result0 = sync_connection.query("SELECT max(idx) as mxidx FROM showinfo");
  let mxidx = result0[0].mxidx;

  let result = sync_connection.query("SELECT f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14_1,f14_2,f15_1,f15_2,f16_1,f16_2 FROM showinfo WHERE idx="+mxidx);
  // ####################################
  // 1	공포 / 탐욕 지수 : 걱정 = 37.9
  // 2	강도 지수 (RSI) : 중간 = 55.1
  // 3	스토캐스틱 : 과매도 [ 2 ] = 8.6
  // 4	트렌드 : 상승장
  // 5	비트코인 시장 점유율 46.81 %
  // 6	비트코인 김프 +1.38%
  // 7	이더리움 김프 +1.45%
  // 8	리플 김프 +1.56%
  // 9	LONG (공매수) 비율 : 68.7%
  // 10	SHORT (공매도) 비율 : 31.4%
  // 11	비트코인 펀딩 비율 06 : 47 : 54 +0.0014%
  // 12	이더리움 펀딩 비율 06 : 47 : 54 +0.0100% 
  // 13	리플 펀딩 비율 06 : 47 : 54 -0.0189%
  // 14	워뇨띠 (aoa) 포지션 2022-06-03　10 : 00 Short
  // 15	3dudes 포지션 2022-06-03　10 : 00 Long
  // 16	BogPear 포지션 2022-06-03　10 : 00
  mainInfo.f1 = result[0].f1;
  mainInfo.f2 = result[0].f2;
  mainInfo.f3 = result[0].f3;
  mainInfo.f4 = result[0].f4;
  mainInfo.f5 = result[0].f5;
  mainInfo.f6 = result[0].f6;
  mainInfo.f7 = result[0].f7;
  mainInfo.f8 = result[0].f8;
  mainInfo.f9 = result[0].f9;
  mainInfo.f10 = result[0].f10;
  mainInfo.f11 = result[0].f11;
  mainInfo.f12 = result[0].f12;
  mainInfo.f13 = result[0].f13;
  mainInfo.f14_1 = result[0].f14_1;
  mainInfo.f14_2 = result[0].f14_2;
  mainInfo.f15_1 = result[0].f15_1;
  mainInfo.f15_2 = result[0].f15_2;
  mainInfo.f16_1 = result[0].f16_1;
  mainInfo.f16_2 = result[0].f16_2;
  
  // console.log(userInfo.klay_ceik_balance + ":klay_ceik_balance");
  return mainInfo;
}

const mainNews = {
	n1_1 : '',
	n1_2 : '',
	n2_1 : '',
	n2_2 : ''
  // print : function(){ console.log('user_email : ' + user_email + '); }
}
function getmainNews(){
  let result = sync_connection.query("SELECT title, url FROM shownews order by idx desc LIMIT 5 ");
  try{
    mainNews.n1_1 = result[0].title;
    mainNews.n1_2 = result[0].url;
    mainNews.n2_1 = result[1].title;
    mainNews.n2_2 = result[1].url;
  }catch(e){
    console.log("no data");
  }
  return getmainNews;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  getmainInfo();
  getmainNews();
  // getwhaleTrInfo();
  let result_KRW = sync_connection.query("SELECT krw as krw FROM show_krw where idx=1 ");
  let _krw = result_KRW[0].krw;

  res.render('index', { title: 'web.c4ei.net' ,krw:_krw , mainInfo:mainInfo , mainNews:mainNews }); //, whaleTrInfo:whaleTrInfo
});

/* GET home page. */
router.get('/api/mainInfo', function(req, res, next) {
  getmainInfo();
  const data = JSON.stringify(mainInfo);
  res.json(data);
});
router.get('/api/whaleTrInfo', function(req, res, next) {
  getwhaleTrInfo();
  const data = JSON.stringify(whaleTrInfo);
  res.json(data);
});
router.get('/api/krw', function(req, res, next) {
  let result_KRW = sync_connection.query("SELECT krw as krw FROM show_krw where idx=1 ");
  let _krw = result_KRW[0].krw;
  const data = JSON.stringify(_krw);
  res.json(data);
});

module.exports = router;
