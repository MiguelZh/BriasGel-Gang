'use strict'

//clase pool 

function ShotsPool(game, entities) {
  this._group = game.add.group();
  this._group.addMultiple(entities);
  this._group.callAll('kill');
}

ShotsPool.prototype.spawn = function (x, y, sprite, dir, angle, color) {
  var entity = this._group.getFirstExists(false);
  if (entity) {
    entity.initialize(x, y, sprite, dir, angle, color);
    entity.revive();
  }
  return entity;
}

ShotsPool.prototype.forEachAlive = function (funcion) {
  this._group.forEachAlive(funcion);
}

var Inkling = require('./Inkling.js');
var Interface = require('./Interface.js');
var GaugeIcon = require('./GaugeIcon.js');
var healthplayer1;
var healthplayer2;
var ammoplayer1;
var ammoplayer2;
var player1;
var player2;
var shots;
var shot = require('./Shot.js');
var players = [];
var middlepoint;
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
    this.layer.resizeWorld();
    this.map.setCollision([1, 2]);
    //creacion de jugadores
    player1 = new Inkling(this.game, this.game.world.centerX + 150, 0, 'Inklingo', 300, -400, Phaser.Keyboard.RIGHT, Phaser.Keyboard.LEFT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.CONTROL, Phaser.Keyboard.R, Phaser.Keyboard.T, 2);
    player2 = new Inkling(this.game, this.game.world.centerX - 150, this.game.world.centerY, 'Inklingp', 300, -400, Phaser.Keyboard.D, Phaser.Keyboard.A, Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.G, Phaser.Keyboard.L, 3);

    //creacion de interfaz
    var backgroundhud = new Interface(this.game, this.game.world.centerX, 50, 'hud', 60, 230);
    backgroundhud.anchor.setTo(0.5, 0.5);
     healthplayer1 = new GaugeIcon(this.game, this.game.world.centerX - 60, 70, 'healthind', 'deadicon', 45, 40, 45, 40, this.game.world.centerX - 60, 70, player1);
     healthplayer2 = new GaugeIcon(this.game, this.game.world.centerX + 20, 70, 'healthind', 'deadicon', 45, 40, 45, 40, this.game.world.centerX + 20, 70, player2);
     ammoplayer1= new GaugeIcon(this.game, this.game.world.centerX - 105, 70, 'ammoind', 'ammoind', 40, 20, 30, 20, this.game.world.centerX - 105, 65, player1);
     //ammoplayer2= new GaugeIcon(this.game, this.game.world.centerX + 80, 70, 'ammoind', 30, 50, player2)


    //guardado en array de jugadores
    players.push(player1);
    players.push(player2);

    middlepoint=this.game.add.sprite(null);
    middlepoint.x=(player1.x+player2.x)/2;
    middlepoint.y=(player1.y+player2.y)/2;




    //seguimiento de camara(temporal)
    this.game.camera.follow(middlepoint);

    //activacion del sistema de físicas
    this.physics.startSystem(Phaser.Physics.ARCADE);

  },

  ////////UPDATE/////////
  update: function () {
    self = this;
    healthplayer1.Update(player1._health);
    healthplayer2.Update(player2._health);
    ammoplayer1.Update(player1._ammo);

    middlepoint.x=(player1.x+player2.x)/2;
    middlepoint.y=(player1.y+player2.y)/2;

    players.forEach(function (player) {
      //colisiones jugadores, mapa
      self.game.physics.arcade.collide(player, self.layer);
      //actualizacion de estado del jugador
      player.update(shots);
      //Colisiones con tile pintado
      var TileGround = self.map.getTile(Math.floor(player.x / 25), Math.floor((player.y + (player.height / 2) + 15) / 25));
      if (TileGround !== null) player.Swim(TileGround.index === player.color);
      else player.Swim(false);
      //colisiones con disparos
      shots.forEachAlive(function (bullet) {
        if (bullet.color !== player.color) self.game.physics.arcade.collide(bullet, player, function () {
          player.Damage(bullet.Damage);
          bullet.kill();
        });
      });

    });


    //colisiones balas con mapa
    shots.forEachAlive(function (each) {
      var TileOnSpawn = self.map.getTileWorldXY(each.x, each.y);
      if (TileOnSpawn !== null) {
        self.map.replace(TileOnSpawn.index, each.color, TileOnSpawn.x, TileOnSpawn.y, 1, 1, self.layer);
        each.kill();
      }
      self.game.physics.arcade.collide(each, self.layer, function () {
        var dir = 0;
        if (each.scale.x >= 0) dir = 1;
        else if (each.scale.x < 0) dir = -1;

        //pintar tile(cambia el index del tile por uno de color)
        var TileCollided = self.map.getTileWorldXY(each.x + dir * self.map.tileWidth, each.y);
        var TileCollided2 = self.map.getTileWorldXY(each.x + dir * self.map.tileWidth, each.y + each.height / 2 + 10);
        var TileCollided3 = self.map.getTileWorldXY(each.x + dir * self.map.tileWidth, each.y - each.height / 2 - 10);
        var TileCollided4 = self.map.getTileWorldXY(each.x + each.width / 2 + 5, each.y + each.height / 2 + 10);
        var TileCollided5 = self.map.getTileWorldXY(each.x + each.width / 2 + 5, each.y - each.height / 2 - 10);
        var TileCollided6 = self.map.getTileWorldXY(each.x - each.width / 2 - 5, each.y + each.height / 2 + 10);
        var TileCollided7 = self.map.getTileWorldXY(each.x - each.width / 2 - 5, each.y - each.height / 2 - 10);

        if (TileCollided !== null) self.map.replace(TileCollided.index, each.color, TileCollided.x, TileCollided.y, 1, 1, self.layer);
        if (TileCollided2 !== null) self.map.replace(TileCollided2.index, each.color, TileCollided2.x, TileCollided2.y, 1, 1, self.layer);
        if (TileCollided3 !== null) self.map.replace(TileCollided3.index, each.color, TileCollided3.x, TileCollided3.y, 1, 1, self.layer);
        if (TileCollided4 !== null) self.map.replace(TileCollided4.index, each.color, TileCollided4.x, TileCollided4.y, 1, 1, self.layer);
        if (TileCollided5 !== null) self.map.replace(TileCollided5.index, each.color, TileCollided5.x, TileCollided5.y, 1, 1, self.layer);
        if (TileCollided6 !== null) self.map.replace(TileCollided6.index, each.color, TileCollided6.x, TileCollided6.y, 1, 1, self.layer);
        if (TileCollided7 !== null) self.map.replace(TileCollided7.index, each.color, TileCollided7.x, TileCollided7.y, 1, 1, self.layer);
        each.kill();
      });

    });

   

  }

};

module.exports = PlayScene;