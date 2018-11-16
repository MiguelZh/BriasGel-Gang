'use strict'

//clase pool 

function ShotsPool(game, entities) {
  this._group = game.add.group();
  this._group.addMultiple(entities);
  this._group.callAll('kill');
}

ShotsPool.prototype.spawn = function (x, y, sprite, dir) {
  var entity = this._group.getFirstExists(false);
  if (entity) {
    entity.revive();

    entity.initialize(x, y, sprite, dir);
  }
  return entity;
}

ShotsPool.prototype.forEachAlive = function (funcion) {
  this._group.forEachAlive(funcion);
}




var Inkling = require('./Inkling.js');
var player;
var shots;
var shot = require('./Shot.js');

var PlayScene = {
  ////////CREATE//////////
  create: function () {
    //creacion de array de balas
    var bullets = [];
    for (var i = 0; i < 100; i++) {
      bullets.push(new shot(this.game));
      bullets[i].kill();
    }

    //creacion del pool de balas 
    shots = new ShotsPool(this.game, bullets);

    //creacion del mapa
    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Capa de Patrones 1');
    this.map.setCollision([1, 2]);
    this.layer.resizeWorld();

    //creacion del jugador
    player = new Inkling(this.game, this.game.world.centerX, 0, 'Inkling', 400, -600);


    //seguimiento de cámara(temporal)
    this.game.camera.follow(player);

    //activacion del sistema de físicas
    this.physics.startSystem(Phaser.Physics.ARCADE);

  },

  ////////UPDATE/////////
  update: function () {
    //colisiones jugador, mapa
    this.game.physics.arcade.collide(player, this.layer);

    //actualizacion de estado del jugador
    player.update(shots);
    this.game.debug.body(player)

    //colisiones balas con mapa
    self = this;
    shots.forEachAlive(function (each) {
      self.game.physics.arcade.collide(each, self.layer, function () {
        var dir = 0;
        var rot = 0;
        if (each.scale.x > 0) dir = 1;
        else if (each.scale.x < 0) dir = -1;
        if (each.rotation > 0) rot = 1;
        else if (each.rotation < 0) rot = -1;
        //pintar tile(cambia el index del tile por uno de color)

        self.map.replace(1, 2, Math.floor((each.x + dir * 15 + ((each.width / 2))) / 64), Math.floor((each.y + dir * rot * (each.height / 2) + 15 * rot * dir) / 64), 1, 1, self.layer);
        each.kill();
      })
    });

  }

};

module.exports = PlayScene;


