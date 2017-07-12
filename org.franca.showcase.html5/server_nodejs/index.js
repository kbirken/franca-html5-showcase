/*******************************************************************************
* Copyright (c) 2014 itemis AG (http://www.itemis.de).
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*******************************************************************************/
var log4js = require('log4js');
log4js.configure('log4js-conf.json');
var logger = log4js.getLogger('Application');

// create http server and listen to port 8080
// we need this to serve index.html and other files to the client
var HttpServer = require('./base/util/HttpServer');
var http = new HttpServer();
http.init(8180, '../client');

// Music player application
var StreamPlayer = require('./applications/StreamPlayer');
var player = new StreamPlayer();

// Vehicle application
var Vehicle = require('./applications/Vehicle');
var vehicle = new Vehicle();
vehicle.init();

// create websocket stub for SimpleUI interface and listen to websocket port.
var SimpleUIStub = require('./gen/org/example/SimpleUIStub');
var stub = new SimpleUIStub(8181);

// set initial values for attributes
stub.clock = getTime();

stub.init();

stub.onClientConnected = function(clientID) {
	logger.info('The ID of the newly connected client is ' + clientID);
};

stub.onClientDisconnected = function(clientID) {
	logger.info('The client with ID ' + clientID + ' has disconnected');
}

stub.playMusic = function (genre, reply) {
	var d = "";
	
	switch (genre) {
		case SimpleUIStub.Genre.M_NONE:   player.stop(); break;
		case SimpleUIStub.Genre.M_POP:    player.play('http://icecast.radio24.ch/radio24pop'); break;
		case SimpleUIStub.Genre.M_TECHNO: player.play('http://firewall.pulsradio.com'); break;
		case SimpleUIStub.Genre.M_TRANCE: player.play('http://firewall.trance.pulsradio.com'); break;
		default: console.error("Invalid value " + genre + " for parameter 'genre'!");
	}
	reply();
}

player.onStreamTitle = function(title) {
	// forward to UI
	stub.playingTitle(title);
}

vehicle.onUpdateVelocity = function(vel) {
    // send velocity broadcast
    stub.updateVelocity(vel);
}

stub.startNavigation = function (street, city, reply) {
	logger.info("startNavigation: street=" + street + " city=" + city);
	reply({
		"routeLength" : street.length + 10*city.length,
		"arrivalTime" : "22:00"
	});
};


var driveTimerID = setInterval(function() {
	stub.setClock(getTime());
}, 1000);

function getTime() {
	var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return hour + ":" + min + ":" + sec
}



