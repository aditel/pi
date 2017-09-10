require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');
var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

const PORT = 1981;
/*
function handleRequest(request, response) {
    response.end('OK');
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
*/

var serve = serveStatic("/media/pi/7A00-D9A7/");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(PORT, function() {
    console.log("started server");
});
