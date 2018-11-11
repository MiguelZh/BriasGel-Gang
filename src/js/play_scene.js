'use strict'

//clase pool 

function ShotsPool(game, entities) {
  this._group = game.add.group();
  this._group.addMultiple(entities);
  this._group.callAll('kill');
}

ShotsPool.prototype.spawn=function(x,y,sprite, dir){
    var entity = this._group.getFirstExists(false);
    if (entity) {
      entity.revive();
     
     entity.initialize(x, y, sprite, dir);
    }
    return entity;
}

ShotsPool.prototype.forEachAlive=function(funcion){
  this._group.forEachAlive(funcion);
}
  



var Inkling = require('./Inkling.js');
var player;
var map; var layer;
var shots;
var shot=require('./Shot.js');

  var PlayScene = {
  create: function () {
    //creacion de array de balas
    var bullets= [];
    for (var i=0; i<100; i++){
      bullets.push(new shot(this.game));
      bullets[i].kill();
    }
    //creacion del pool de balas 
    shots=new ShotsPool(this.game, bullets);
    //creacion del mapa
    map= this.game.add.tilemap('tilemap');
    map.addTilesetImage('tileset');
    layer= map.createLayer('Capa de Patrones 1');
    map.setCollision([1,2]);
    layer.resizeWorld();
    //creacion del jugador
   player= new Inkling (this.game, this.game.world.centerX, 0, 'Inkling',400,-600);
  
   //seguimiento de cámara(temporal)
   this.game.camera.follow(player);
   //activacion del sistema de físicas
   this.physics.startSystem(Phaser.Physics.ARCADE);
   
  },
  update: function () {
    //colisiones jugador, mapa
    this.game.physics.arcade.collide(player,layer);

    //actualizacion de estado del jugador
    player.update(shots);
    
    //colisiones balas con mapa
    self=this;
    shots.forEachAlive(function(each){self.game.physics.arcade.collide(each, layer, function(){each.kill();})});

  }

};

module.exports = PlayScene;


