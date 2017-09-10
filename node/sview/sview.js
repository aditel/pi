// var http = require('http');
var express = require('express');
var url = require('url');
var request_module = require('request');
var mysql = require('mysql');

var app = express();
const PORT = 8080;
var tzoffset = (new Date()).getTimezoneOffset() * 60000;

var connection;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



app.get('/', addTemperature);
app.get('/getTemperatureSensors', getTemperatureSensors);
app.get('/getLatestData', getLatestData);
app.get('/getCamera', getCamera);
app.listen(PORT);

function databaseConnect() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sensors'
    });
    connection.connect(function(err) {
        if (err) {
	    console.error('error connecting: ' + err.stack);
	    return;
	}
    });
}

function databaseDisconnect() {
    if(connection) {
	connection.end();
    }
}

function databaseQuery(query, callback) {
    databaseConnect();
    if(connection) {
        connection.query(query, function(err, results, fields) {
	    if(callback) {
		callback(err, results, fields);
	    }
	});
    }
    databaseDisconnect();
}

function addTemperature(request, response) {
    var data = url.parse(request.url, true).query;
    if(!data.s || !data.t || !data.h) {
	return;
    }
    var sid = data.s;
    var temp = data.t;
    var humid = data.h;
    databaseQuery("INSERT INTO th(ts, sid, temp, humid) VALUES (" + 
	"CURRENT_TIMESTAMP()" + ", " + sid + ", " + temp + ", " + humid + ")");
    console.log(new Date(Date.now() - tzoffset).toISOString() + " - Received " + temp + ", " + humid);
    response.end('OK');
}

function getTemperatureSensors(request, response) {
    databaseQuery("SELECT sid s, temp t, humid h FROM (SELECT * FROM th ORDER BY sid, ts DESC) th GROUP BY s", function(err, results, fields) {
	response.end(JSON.stringify(results));
    });
}

function getLatestData(request, response) {
    var data = url.parse(request.url, true).query;
    if(!data.sid) {
	response.end('Input sid');
    }
    databaseQuery("SELECT ts AS ts, temp AS t, humid AS h FROM th WHERE sid=" + data.sid + " ORDER BY ts DESC LIMIT 145", function(err, results, fields) {
	results = results.filter(function(elem, index, array) {
	    return true;//index % 6 == 0;
	}).sort(function(elem1, elem2) {
	    return elem1.ts - elem2.ts;
	});
	response.end(JSON.stringify(results));
    });
}

function getCamera(request, response) {
    request_module.get('http://192.168.0.24/tmpfs/auto.jpg', {
	'auth': {
	    'user': 'admin',
	    'pass': 'admin',
	    'sendImmediately': false
	}
    }).pipe(response);
}
