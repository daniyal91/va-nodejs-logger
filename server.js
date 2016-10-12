var express = require('express');
var fs = require('fs');

// Initializing an instance of express
var app = express();

// Setting the port
var port = process.env.PORT || 9002;

// Setting view engine to ejs
app.set('view engine','ejs');

// Make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  next();
});


// Set home page route
app.get('/', function(req,res){
	// ejs render automatically looks in the views folder
	res.render('index');
});

// Set record log route
app.get('/record_log',function(req,res){
	var message = req.query.msg;
	var sender = req.query.sender;
	var date = new Date();
	var currentDate = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
	var currentTime = (date.getHours()-4) + ":" + date.getMinutes() + ":" + date.getSeconds();
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

	var msgData = {message: message, sender: sender, date: currentDate, time: currentTime, ip: ip};

	fs.readFile("logs/log.json", function (err, data) {
    var json = JSON.parse(data);
    json.push(msgData);

    fs.writeFile("logs/log.json", JSON.stringify(json));
	});
	res.json({message: 'Message recorded successfully.'});
});

// Set log route
app.get('/logs', function(req,res){
	fs.readFile("logs/log.json", 'utf8', function(err, data) {
	  if (err){
	  	throw err;
	  }
	  res.render('log',{data: data});
	});
});

app.listen(port, function(){
	console.log('Our app is running on http://localhost:' + port);
});