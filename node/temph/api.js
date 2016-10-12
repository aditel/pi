var http = require('http');
var express = require('express');
//var gpio = require('rpi-gpio');
//var dht = require('dht-sensor');
var dht = require('node-dht-sensor');
var app = express();

var PIN_TEMPERATURE = 18;


//initDhtSensor();
//setInterval(readDhtValues, 500);
initVariables();
initDhtSensor();
initServer();

function initVariables() {
    dhtValues = {
	temperature: -1,
	humidity: -1
    };
    dhtSensor = {
	initialize: function () {
	    return dht.initialize(11, PIN_TEMPERATURE);
	},
	read: function () {
	    var readout = dht.read();
	    dhtValues.temperature = readout.temperature.toFixed(2) + 'C';
	    dhtValues.humidity = readout.humidity.toFixed(2) + '%';
	    setTimeout(function () {
        	dhtSensor.read();
	    }, 500);
	}
    };
}

function initDhtSensor() {
    if (dhtSensor.initialize()) {
        dhtSensor.read();
    } else {
	console.warn('Failed to initialize sensor');
    }
}

function initServer() {
    app.get('/temph', function(req, res) {
	res.status(200).send('Temperature: ' + dhtValues.temperature);
    });

    app.get('*', function(req, res) {
	res.status(404).send('Unrecognized API call!');
    });

    app.listen(8081);
    process.on('SIGINT', exit);
}

/*
function initDhtSensor() {

    app.get('/temph', function(req, res) {
	res.status(200).send('temperature: ' + values.temp);
    });

    app.get('*', function(req, res) {
	res.status(404).send('Unrecognized API call!');
    });

    app.listen(8081);
    process.on('SIGINT', exit);
}

function readDhtValues() {
    values.temp = dht.read(11, PIN_TEMPERATURE).temperature;
}
*/

function exit() {
    process.exit(0);
}
