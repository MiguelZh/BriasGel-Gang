'use strict'

//clase pool 

function ShotsPool(game, entities) {
  this._group = game.add.group();
  this._group.addMultiple(entities);
  this._group.callAll('kill');
}

ShotsPool.prototype.spawn = function (x, y, sprite, dir, color) {
  var entity = this._group.getFirstExists(false);
  if (entity) {
    entity.initialize(x, y, sprite, dir, color);
    entity.revive();
  }
  return entity;
}

ShotsPool.prototype.forEachAlive = function (funcion) {
  this._group.forEachAlive(funcion);
}

var Inkling = require('./Inkling.js');
var player1;
var player2;
var shots;
var shot = require('./Shot.js');
var players = [];

var PlayScene = {
  ////////CREATE//////////
  create: function () {
    //creacion de array de balas
    var bullets = [];
    for (var i = 0; i < 20; i++) {
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

    //creacion de jugadores
    player1 = new Inkling(this.game, this.game.world.centerX, 0, 'Inkling', 400, -600, Phaser.Keyboard.RIGHT, Phaser.Keyboard.LEFT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.CONTROL, 0);
    player2 = new Inkling(this.game, 400, this.game.world.centerY, 'Inkling2', 400, -600, Phaser.Keyboard.D, Phaser.Keyboard.A, Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.SPACEBAR, 1);
    player1.name = 1;
    player2.name = 2;
    //guardado en array de jugadores
    players.push(player1);
    players.push(player2);


    //seguimiento de camara(temporal)
    this.game.camera.follow(player1);

    //activacion del sistema de físicas
    this.physics.startSystem(Phaser.Physics.ARCADE);

  },

  ////////UPDATE/////////
  update: function () {
    self = this;

    players.forEach(function (player) {
      //colisiones jugadores, mapa
      self.game.physics.arcade.collide(player, self.layer);
      //actualizacion de estado del jugador
      player.update(shots);
      //Colisiones con tile pintado
      var TileGround = self.map.getTile(Math.floor(player.x / 64), Math.floor((player.y + (player.height / 2) + 15) / 64));
      if (TileGround !== null) player.Swim(TileGround.index === 2);
      else player.Swim(false);
      //colisiones con disparos
      shots.forEachAlive(function (bullet) {
        if (bullet.color !== player.color) self.game.physics.arcade.collide(bullet, player, function () {
          player.Damage(5);
          bullet.kill();
        });

      });



    });

    //colisiones balas con mapa
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