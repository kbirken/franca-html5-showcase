/*******************************************************************************
* Copyright (c) 2014 itemis AG (http://www.itemis.de).
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*******************************************************************************/

Player = require('player');

/*
    Music player component.

    Currently it is able to play mp3 files from local or remote (URL).
*/

function MusicPlayer() {
  this.player = null;
}

// export the "constructor" function to provide a class-like interface
module.exports = MusicPlayer;

MusicPlayer.prototype.play = function(file) {
  var _this = this;

  // stop existing instance of Player (if any)
  if (_this.player) {
    _this.player.stop();
    _this.player = null;
  }

  // create new instance of Player
  _this.player = new Player(file);

  _this.player.on('playing',function(item){
      // return playing item
      console.log('im playing... src:' + item);
      console.log(item);
  });

  _this.player.on('playend',function(item){
      // return a playend item
      console.log('src:' + item + ' play done, switching to next one ...');
  });

  _this.player.on('error', function(err){
      // when error occurs
      console.log(err);
  });


  // play the mp3 file
  _this.player.play();

  // if (typeof(_this.onStreamTitle) === "function") {
  //   if (parsed.StreamTitle && parsed.StreamTitle.length>3) {
  //     // send title information to client
  //     _this.onStreamTitle(parsed.StreamTitle);
  //   } else {
  //     // use genre as default
  //     if (_this.genre) {
  //       _this.onStreamTitle(_this.genre);
  //     }
  //   }
  // }
}

MusicPlayer.prototype.stop = function() {
  if (this.player) {
    this.player.stop();
    this.player = null
  }
}
