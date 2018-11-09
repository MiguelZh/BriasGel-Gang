'use strict'

var Inkling = require('./Inkling.js');
var player;
var map; var layer;
  var PlayScene = {
  create: function () {
    map= this.game.add.tilemap('tilemap');
    map.addTilesetImage('tileset');
    layer= map.createLayer('Capa de Patrones 1');
    map.setCollision([1,2]);
    layer.resizeWorld();
   player= new Inkling (this.game, this.game.world.centerX, 0, 'Inkling',400,-600, 'bullet');
  
   this.game.camera.follow(player);
   this.physics.startSystem(Phaser.Physics.ARCADE);
   
  },
  update: function () {

    this.game.physics.arcade.collide(player,layer);
    player.update();
   
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.O)) map.replace(1,2);
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)) map.replace(2,1);
  }

};

module.exports = PlayScene;


