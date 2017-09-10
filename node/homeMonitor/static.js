var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

const PORT = 1231;

var serve = serveStatic(__dirname);

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(PORT, function() {
});
