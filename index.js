var linebot = require('linebot');
var express = require('express');
var getJSON = require('get-json');

var bot = linebot({
	channelId: '',
	channelSecret: '',
	channelAccessToken: ''
});

/*bot.on('message', function(event) {
    console.log(event); //把收到訊息的 event 印出來看看
});*/

//重複說過的話
/*bot.on('message', function(event) {
    if (event.message.type = 'text') {
      var msg = event.message.text;
      event.reply(msg).then(function(data) {
        // success 
        console.log(data);
        console.log(msg);
      }).catch(function(error) {
        // error 
        console.log('error');
      });
    }
});*/

/*setTimeout(function(){
    var userId = 'dracula45678';
    var sendMsg = 'XXXXXXX';
    bot.push(userId,sendMsg);
    console.log('send: '+sendMsg);
},5000);*/

/*var timer2;
_japan();
function _japan() {
  clearTimeout(timer2);
  request({
    url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {
      return;
    } else {
      var $ = cheerio.load(body);
      var target = $(".rate-content-sight.text-right.print_hide");
      console.log(target[15].children[0].data);
      jp = target[15].children[0].data;
      if (jp < 0.28) {
        bot.push('使用者 ID', '現在日幣 ' + jp + '，該買啦！');
      }
      timer2 = setInterval(_japan, 30000);
    }
  });
}*/

var timer;
//var pm = [];
_getJSON();
//_japan();
//_bot();

bot.on('message', function (event) {
	if (event.message.type = 'text') {
		var msg = event.message.text;
		if (msg == '美金' || msg == '台幣') {
			getmenoy(event, 'USDTWD', '台幣');
		}
		else if (msg == "日幣") {
			getmenoy(event, 'USDJPY', '日幣');
		}
	}
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});

function getmenoy(ev, country, to_other) {
	getJSON('https://tw.rter.info/capi.php', function (error, response) {
		console.log(country + response.USDTWD.Exrate + "更新時間" + response.USDTWD.UTC);
		var tmpmm = "美金兌換成" + to_other + response[country].Exrate + "更新時間" + response[country].UTC + "加8小時為台灣時間";

		ev.reply(tmpmm).then(function (data) {
			// success 
			console.log(tmpmm);
		}).catch(function (error) {
			// error 
			console.log('error');
		});
	});
}

/*function _bot() {
  bot.on('message', function(event) {
    if (event.message.type == 'text') {
      var msg = event.message.text;
      var replyMsg = '';
      if (msg.indexOf('PM2.5') != -1) {
        pm.forEach(function(e, i) {
          if (msg.indexOf(e[0]) != -1) {
            replyMsg = e[0] + '的 PM2.5 數值為 ' + e[1];
          }
        });
        if (replyMsg == '') {
          replyMsg = '請輸入正確的地點';
        }
      }
      if (replyMsg == '') {
        replyMsg = '不知道「'+msg+'」是什麼意思 :p';
      }

      event.reply(replyMsg).then(function(data) {
        console.log(replyMsg);
      }).catch(function(error) {
        console.log('error');
      });
    }
  });

}*/

/*function _getJSON() {
  clearTimeout(timer);
  getJSON('http://opendata2.epa.gov.tw/AQX.json', function(error, response) {
    console.log(response);
    response.forEach(function(e, i) {
      pm[i] = [];
      pm[i][0] = e.SiteName;
      pm[i][1] = e['PM2.5'] * 1;
      pm[i][2] = e.PM10 * 1;
    });
  });
  timer = setInterval(_getJSON, 20000); //每半小時抓取一次新資料
}*/
function _getJSON() {
	clearTimeout(timer);
	getJSON('https://tw.rter.info/capi.php', function (error, response) {
		console.log('美金兌台幣' + response.USDTWD.Exrate + "更新時間" + response.USDTWD.UTC);
		if (response.USDTWD.Exrate < 29.7) {
			bot.push('Ubbe377b88e7a43fc5eb95b2bd6457913', '美金兌台幣 ' + response.USDTWD.Exrate + '，該買啦！');
		}
	});
	timer = setInterval(_getJSON, 1800000); //每半小時抓取一次新資料
}

/*function _japan() {
  clearTimeout(timer2);
  request({
    url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {
      return;
    } else {
      var $ = cheerio.load(body);
      var target = $(".rate-content-sight.text-right.print_hide");
      console.log(target[15].children[0].data);
      jp = target[15].children[0].data;
      //if (jp < 0.28) {
        bot.push('使用者 ID', '現在日幣 ' + jp + '，該買啦！');
      //}
      timer2 = setInterval(_japan, 20000);

    }
  });
}*/


/*const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
var port = server.address().port;
console.log("App now running on port", port);
});*/