var gpio = require('rpi-gpio');

var pir = {
    pin: 40,
    loopTime: 500, //check the sensor this often 
    tripped: false,
    value: undefined
}

var led = {
    pin: 37,
    ready: false
}

var readInterval = function() {
    gpio.read(pir.pin, function(error, value) { // we only want to move on if something changed 
	if (value === pir.tripped) {
	    return;
	}
	pir.tripped = value;
	if (pir.tripped) {
	    triggerLed(true);
	    console.log('Person in room!');
	} else {
	    triggerLed(false);
	    console.log("...empty...");
	}
    });
};

function onSetup(error) {
    if (error) console.error(error);
    return setInterval(readInterval, pir.loopTime);
}

function triggerLed(value) {
    if(led.ready) {
	console.log('writing to led..');
	gpio.write(led.pin, value, function(err) {
	    if (err) throw err;
	});
    }
}

process.on('SIGINT', function () {
    gpio.destroy(function() {
	clearInterval(readInterval);
	process.exit(0);
    });
});

gpio.setMode(gpio.MODE_RPI);
gpio.setup(pir.pin, gpio.DIR_IN, onSetup);
gpio.setup(led.pin, gpio.DIR_OUT, function() {
    led.ready = true;
});
