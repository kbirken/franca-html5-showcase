/*******************************************************************************
* Copyright (c) 2014 itemis AG (http://www.itemis.de).
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*******************************************************************************/

MQTT = require('mqtt');

/*
    MQTT client component.

    Will do some experimental interaction between this application and
    some MQTT server.
*/

function MQTTClient() {
  this.client = null;
}

// export the "constructor" function to provide a class-like interface
module.exports = MQTTClient;

MQTTClient.prototype.connect = function(port, host) {
  var _this = this;

  _this.client = MQTT.createClient(port, host);

  console.log("MQTT: subscribing!");

  _this.client.subscribe('foobar53');
  _this.client.subscribe('$SYS/broker/bytes/received');

 _this.client.publish('foobar53', 'Just a test', {retain: true});
  // _this.client.publish('foobar53', 'Just a test');

  _this.client.on('message', function (topic, message) {
    console.log("topic=" + topic + " message=" + message);
    _this.client.end();
  });


  // _this.client.end();
}

