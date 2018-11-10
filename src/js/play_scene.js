'use strict'

function Pool(game, entities) {
  this._group = game.add.group();
  this._group.addMultiple(entities);
  this._group.callAll('kill');
}

Pool.prototype.spawn=function(x,y){
    var entity = this._group.getFirstExists(false);
    if (entity) {
      entity.reset(x, y);
    }
    return entity;
}

Pool.prototype.forEachAlive=function(funcion){
  this._group.forEachAlive(funcion);
}
  



var Inkling = require('./Inkling.js');
var player;
var map; var layer;
var pool;
var shot=require('./Shot.js');

  var PlayScene = {
  create: function () {
    var bullets= [];
    for (var i=0; i<100; i++){
      bullets.push(new shot(this.game));
      
    }
    console.log(bullets);
    pool=new Pool(this.game, bullets);
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
    player.update(pool);
    self=this;
    pool.forEachAlive(function(item){ item.update(); self.game.physics.arcade.collide(item, self.game.layer, item.kill()); });
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.O)) map.replace(1,2);
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)) map.replace(2,1);
  }

};

module.exports = PlayScene;


