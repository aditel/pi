var http = require('http');
var url = require('url');
var mysql = require('mysql');

var connection = mysql.createConnection({
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

const PORT = 8080;

function handleRequest(request, response) {
    var data = url.parse(request.url, true).query;
    if(!data.t || !data.h) {
	return;
    }
    response.end('OK');
    var sid = data.s;
    var temp = data.t;
    var humid = data.h;
    connection.query("INSERT INTO th(ts, sid, temp, humid) VALUES (" + 
	"CURRENT_TIMESTAMP()" + ", " + sid + ", " + temp + ", " + humid + ")");
    console.log("Received " + temp + ", " + humid);

//    db.each("SELECT * FROM th ORDER BY id DESC LIMIT 1", function(err, row) {
//	console.log(row.temp + "C " + row.humid + "%");
//    });
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
