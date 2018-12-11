(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Interface = require('./Interface.js');


var GaugeIcon = function (game, x, y, sprite, spriteempty, height, width, backgroundh, backgroundw, backgroundx, backgroundy, player) {
    this.player=player;
    this.sprite = sprite;
    this.spriteempty=spriteempty;
    this.backgroundheight=backgroundh;
    if (this.player.color === 2) this.backgroundsprite = 'backgroundor';
    else this.backgroundsprite = 'backgroundpu';
    this.background = new Interface(game, backgroundx, backgroundy, this.backgroundsprite, backgroundh, backgroundw);
    this.background.anchor.setTo(0,1)
    Interface.call(this, game, x, y, sprite, height, width);
    this.smoothed=false;
    this.anchor.setTo(0,1)
    this.game.add.existing(this.background);
    this.game.add.existing(this);
}
GaugeIcon.prototype = Object.create(Interface.prototype);
GaugeIcon.prototype.constructor = GaugeIcon;

GaugeIcon.prototype.Update = function (stat) {
    if (this.stat <= 0) this.loadTexture(this.spriteempty);
    else this.loadTexture(this.sprite);
    
    this.background.height = stat / 100 * this.backgroundheight;
}

module.exports = GaugeIcon;
},{"./Interface.js":3}],2:[function(require,module,exports){
'use strict'
var shot = require('./Shot.js')

var Inkling = function (game, x, y, sprite, speed, jump, RIGHT, LEFT, JUMP, SWIM, SHOOT, DGUP, DGDOWN, color,gamepad) {
  //Atributos
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.smoothed=false;
  this.kidspeed = speed;
  this.squidspeed = speed * 0.5;
  this.swimspeed = speed * 1.95;
  this.respawnpointx=x;
  this.respawnpointy=y;
  this._speed = speed;
  this._jump = jump;
  this._health = 100;
  this._ammo = 100;
  this.iskid = true;
  this.shooting = false;
  this.isswimming = false;
  this.isclimbing=false;
  this.climbingside=0;
  this.nextfire = 0;
  this.timeheals = 0;
  this.timerecharge = 0;
  this.hittime;
  this.color = color;
  if (this.color === 2) this.bullet = 'bulleto';
  else this.bullet = 'bulletp';

  this.pad = gamepad;
  this.game.input.gamepad.start();
  this.pad1=this.game.input.gamepad.pad1;
  if(this.game.input.gamepad.supported && this.game.input.gamepad.active ){
    console.log("Hola!!!!!");
  }
  //Controles
  this.mrightkey = RIGHT;
  this.mleftkey = LEFT;
  this.jumpkey = JUMP;
  this.transkey = SWIM;
  this.shootkey = SHOOT;
  this.aimup=DGUP;
  this.aimdown=DGDOWN;

  //Físicas
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;
  this.body.gravity.y = 800;
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;


  //Animaciones
  this.game.add.existing(this);
  this.frame = 0;
  this.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 9, true);
  this.animations.add('jump', [10, 11, 12, 13, 14, 15], 9, false);
  this.animations.add('run', [20, 21, 22, 23, 24, 25, 26, 27], 9, true);
  this.animations.add('transform', [30, 31, 32, 33, 34], 9, false);
  this.animations.add('detransform', [34, 33, 32, 31, 30], 9, true);
  this.animations.add('squididle', [60, 61], 9, true);
  this.animations.add('movesquid', [60, 61, 62, 63], 9, true);
  this.animations.add('fall', [70, 71], 9, true);
  this.animations.add('shootidle', [41, 42, 43, 44], 9, false);
  this.animations.add('shootrun', [50, 51, 52, 53, 54, 55, 56, 57], 9, false);
  this.animations.add('swim', [90, 91, 92, 93], 9, true);
  this.animations.add('swimidle', [90, 91], 9, true);


  this.anchor.setTo(0.5, 1);
  this.scale.setTo(this.scale.x * 1.1, this.scale.y * 1.1);


}
Inkling.prototype = Object.create(Phaser.Sprite.prototype);
Inkling.prototype.constructor = Inkling;

//Atributos Estáticos
Inkling.prototype.FireRate = 200;
Inkling.prototype.RegenRate = 500;
Inkling.prototype.RegenLatency = 1000;
Inkling.prototype.ShotCost=10;
Inkling.prototype.RechargeRate = 200;
Inkling.prototype.AutoRechargeTime=4000;
Inkling.prototype.AngleUp=45;
Inkling.prototype.AngleDown=-45;
Inkling.prototype.NeutralAngle=0;

//Métodos Inkling

Inkling.prototype.update = function (Pool) {
  var dir = 0;

  //movimiento teclado y mando
  if (this.iskid || !this.body.onFloor()) this._speed = this.kidspeed;
  else if (!this.isswimming) this._speed = this.squidspeed;
  else this._speed = this.swimspeed;

  if (this.game.input.keyboard.isDown(this.mrightkey)||(this.pad===true &&(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1))) dir = 1;
  else if (this.game.input.keyboard.isDown(this.mleftkey) || (this.pad===true && (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1))) dir = -1;

  this.Movement(dir);

  //Salto
  if (this.body.onFloor() && (this.game.input.keyboard.isDown(this.jumpkey) || this.pad && (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1))) this.body.velocity.y = this._jump;

  //transformacion
  if (this.game.input.keyboard.isDown(this.transkey)||(this.pad ===true && this.pad1.isDown(Phaser.Gamepad.XBOX360_A))) this.iskid = false;
  else this.iskid = true;
  


  //disparo
  if ((this.game.input.keyboard.isDown(this.shootkey)||(this.pad ===true && this.pad1.isDown(Phaser.Gamepad.XBOX360_X))) && this.iskid) {
    this.shooting = true;
    this.Fire(Pool);
  }
  else this.shooting = false;

  if (this.isswimming) this.Recharge();
  
  this.Animator();
  this.HurtBoxShift();
  this.Heal();
  this.AutoRecharge();
}

Inkling.prototype.Swim = function (bool, side) {
  this.isswimming = bool && !this.iskid;
  if(this.isswimming){
  if(side!==0){ 
    this.isclimbing=true;
    this.climbingside=side;
  }
  else this.isclimbing=false;
}
else this.isclimbing=false;
}

Inkling.prototype.HurtBoxShift = function () {
  if (!this.iskid) {
    if(this.isclimbing)
      this.body.setSize(3, 30, 23, 42);
    else if (this.isswimming) {
      this.body.setSize(30, 3, 5, 50);
    }
    else this.body.setSize(20, 7, 10, 45);
  }
  else this.body.setSize(20, 42, 10, 11);

}

Inkling.prototype.Animator = function () {
  //Animaciones del calamar
  if (!this.iskid) {
    //animaciones en tierra
    if (!this.isswimming) {
      if (this.body.velocity.x === 0 && this.body.velocity.y === 0)
        this.animations.play('squididle', 3, false);
      else this.animations.play('movesquid', 9, true);
    }
    else {
      //animaciones nadando
      if(!this.isclimbing) this.angle=0;
      else this.angle=-this.climbingside*90;
      if (this.body.velocity.x === 0) this.animations.play('swimidle', 3, false);
      else this.animations.play('swim', 9, true);
    }
  }
  //Animaciones de la niña
  else {
    //Animaciones en el suelo
    if (this.body.onFloor()) {
      if (this.game.input.keyboard.isDown(this.jumpkey) || this.pad && (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)) this.animations.play('jump', 9, false);
      else {
        if (this.body.velocity.x === 0) {
          if (!this.shooting)
            this.animations.play('idle');
          else this.animations.play('shootidle', 9, true);
        }
        else {
          if (!this.shooting) this.animations.play('run');
          else this.animations.play('shootrun', 9, true);
        }
      }

    }
    //Animaciones en el aire
    else {
      if (this.body.velocity.y >= 0 && !this.shooting) {
        this.animations.play('fall', 9, false);
      }
      else if (this.shooting) this.animations.play('shootidle');
    }

  }
}

Inkling.prototype.Movement = function (dir) {
  if(!this.isclimbing){
    this.angle=0;
    if (this.scale.x * dir < 0) this.scale.x = -this.scale.x;//cambio de orientación de sprite
    this.body.velocity.x = dir * this._speed;
  }
  else {
    this.body.velocity.y=dir*this._speed*-this.climbingside;
  }
}


Inkling.prototype.Heal = function () {
  if (this._health < 100) {
    var timesincelasthit = this.game.time.now - this.hit;
    var timebetweenheals = this.game.time.now - this.timeheals;

    if (timebetweenheals >= this.RegenRate && timesincelasthit >= this.RegenLatency) {
      this._health += 5;
      this.timeheals = this.game.time.now;
    }
  }
}

Inkling.prototype.Damage = function (damage) {
  this._health -= damage;//ser dañado
  if(this._health<=0) this.Respawn();
  this.timeheals = this.game.time.now;
  this.hit = this.game.time.now;
}

Inkling.prototype.Respawn= function(){
  this._health=100;
  this._ammo=100;
  this.x=this.respawnpointx;
  this.y=this.respawnpointy;
}
Inkling.prototype.AmmoDecrease = function () {
  this._ammo -= this.ShotCost;
  if(this._ammo<=0){
    this._ammo=0;
    this.lastshot=this.game.time.now;
  }
}

Inkling.prototype.AutoRecharge=function(){
  if(this._ammo<=0 && this.game.time.now-this.lastshot>=this.AutoRechargeTime)
    this._ammo=20;
}

Inkling.prototype.Recharge = function () {
  if (this._ammo < 100) {
    var timebetweenrecharges = this.game.time.now - this.timerecharge;
    if (timebetweenrecharges >= this.RechargeRate) {
      this._ammo += 5;
      this.timerecharge = this.game.time.now;
    }
  }
}


Inkling.prototype.Fire = function (Pool) {
  //aumento de velocidad de la bala si se esta moviendo
  var angle=this.NeutralAngle;
  if(this.game.input.keyboard.isDown(this.aimup)) angle=this.AngleUp;
  else if(this.game.input.keyboard.isDown(this.aimdown)) angle=this.AngleDown;

  if (this._ammo > 0) {
    if (this.game.time.now > this.nextfire) {//si ha pasado suficiente tiempo entre disparos
      this.nextfire = this.game.time.now + this.FireRate;
      this.AmmoDecrease();
      if(Pool!==undefined){
        if (this.scale.x < 0) {
          Pool.spawn(this.body.x, this.body.y+this.body.height/2, this.bullet, -1, angle, this.color);//disparo hacia la izquierda
        }
        else {
          Pool.spawn(this.body.x + this.body.width, this.body.y+this.body.height/2, this.bullet, 1, angle, this.color);//disparo hacia la derecha
      }
    }
    }
  }
}





module.exports = Inkling;
},{"./Shot.js":4}],3:[function(require,module,exports){
var Interface = function (game, x, y, sprite, height, width) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.height=height;
    this.width=width;
    this.smoothed=false;
    this.game.add.existing(this);
    this.fixedToCamera=true;
    this.anchor.setTo(0, 0);
}

Interface.prototype = Object.create(Phaser.Sprite.prototype);
Interface.prototype.constructor = Interface;

module.exports = Interface;
},{}],4:[function(require,module,exports){
'use strict'

var Shot = function (game) {

    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, 'bulletp');



    //Físicas
    this.game.physics.arcade.enable(this);


    this.body.outOfBoundsKill = true;

    //Sprite
    this.game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(this.scale.x * 0.8, this.scale.y * 0.8);
    this.rotation = Math.atan((this.body.velocity.y) / this.body.velocity.x);

}
Shot.prototype = Object.create(Phaser.Sprite.prototype);
Shot.prototype.constructor = Shot;

//Atributos estáticos
Shot.prototype.Speed = 700;
Shot.prototype.Fall = 400;
Shot.prototype.Damage = 20;

//Inicialización de la bala (llamada al salir del pool)
Shot.prototype.initialize = function (x, y, sprite, dir, angle, color) {
    this.color = color;
    this.body.velocity.y = 0;//reseteo de la velocidad
    this.body.velocity.x = 0;
    this.x = x;
    this.y = y;
    this.loadTexture(sprite, 0);
    this.body.velocity.x = this.Speed * dir;
    this.body.velocity.y= Math.tan(angle * Math.PI/180) * this.body.velocity.x*dir;
    if (this.body.velocity.x * this.scale.x < 0) this.scale.x = this.scale.x * -1;
    this.body.gravity.y = this.Fall;

}


Shot.prototype.update = function () {
    //ajuste de rotación a la direccion de la bala
    this.rotation = Math.atan((this.body.velocity.y) / this.body.velocity.x);
}

module.exports = Shot;
},{}],5:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'assets/sprites/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'assets/sprites/phaser.png');
    this.game.load.spritesheet('Inklingo', 'assets/sprites/SpriteSheetInkling.png', 50, 53);
    this.game.load.spritesheet('Inklingp', 'assets/sprites/SpriteSheetInkling2.png', 50, 53);
    this.game.load.tilemap('tilemap', 'assets/tilemap/tilemap2.Json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tileset', 'assets/tileset/tileset.png');
    this.game.load.image('bulleto', 'assets/sprites/BalaPintura.png');
    this.game.load.image('bulletp', 'assets/sprites/BalaPintura2.png');
    this.game.load.image('hud', 'assets/sprites/FondoInterfaz.png');
    this.game.load.image('backgroundor', 'assets/sprites/OrangeBackground.png');
    this.game.load.image('backgroundpu', 'assets/sprites/PurpleBackground.png');
    this.game.load.image('healthind', 'assets/sprites/HealthIcon.png');
    this.game.load.image('deadicon', 'assets/sprites/F.png');
    this.game.load.image('ammoind', 'assets/sprites/InkTank.png')
  

  },

  create: function () {
    this.game.state.start('play');

  }
};

//800, 600, Phaser.AUTO, 'game',true, false, false
window.onload = function () {
  var game = new Phaser.Game({
    width: 800,
    height: 600,
    parent: 'game',
    input: {
      gamepad: true,
    },
  });

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};











































},{"./play_scene.js":6}],6:[function(require,module,exports){
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
var shot = require('./Shot.js');

var PlayScene = {
  ////////CREATE//////////
  create: function () {
    //creacion de array de balas
    var bullets = [];
    for (var i = 0; i < 20; i++) {
      bullets.push(new shot(this.game));
      bullets[i].kill();
    }
    // inicializacion del gamepad
 

    //creacion del pool de balas 
    this.shots = new ShotsPool(this.game, bullets);

    //creacion del mapa
    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Capa de Patrones 1');
    this.layer.resizeWorld();
    this.map.setCollision([1, 2]);
    //creacion de jugadores
    this.player1 = new Inkling(this.game, this.game.world.centerX + 150, 0, 'Inklingo', 300, -400, Phaser.Keyboard.D, Phaser.Keyboard.A, Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.P, Phaser.Keyboard.O, 2,false);
    this.player2 = new Inkling(this.game, this.game.world.centerX - 150, this.game.world.centerY, 'Inklingp', 300, -400, Phaser.Gamepad.XBOX360_DPAD_LEFT , Phaser.Gamepad.XBOX360_STICK_LEFT_X, Phaser.Gamepad.XBOX360_DPAD_UP , Phaser.Gamepad.XBOX360_DPAD_DOWN ,  Phaser.Gamepad.XBOX360_X, Phaser.Keyboard.G, Phaser.Keyboard.F, 3,true);

    //creacion de interfaz
    var backgroundhud = new Interface(this.game, this.game.world.centerX, 50, 'hud', 60, 230);
    backgroundhud.anchor.setTo(0.5, 0.5);
     this.healthplayer1 = new GaugeIcon(this.game, this.game.world.centerX - 60, 70, 'healthind', 'deadicon', 45, 40, 45, 40, this.game.world.centerX - 60, 70, this.player1);
     this.healthplayer2 = new GaugeIcon(this.game, this.game.world.centerX + 20, 70, 'healthind', 'deadicon', 45, 40, 45, 40, this.game.world.centerX + 20, 70, this.player2);
     this.ammoplayer1= new GaugeIcon(this.game, this.game.world.centerX - 105, 70, 'ammoind', 'ammoind', 40, 20, 30, 20, this.game.world.centerX - 105, 65, this.player1);
     //ammoplayer2= new GaugeIcon(this.game, this.game.world.centerX + 80, 70, 'ammoind', 30, 50, player2)


    //guardado en array de jugadores
    this.players=[];
    this.players.push(this.player1);
    this.players.push(this.player2);

    this.middlepoint=this.game.add.sprite(null);
    this.middlepoint.x=(this.player1.x+this.player2.x)/2;
    this.middlepoint.y=(this.player1.y+this.player2.y)/2;



    //seguimiento de camara(temporal)
    this.game.camera.follow(this.middlepoint);

    //activacion del sistema de físicas
    this.physics.startSystem(Phaser.Physics.ARCADE);

  },

  ////////UPDATE/////////
  update: function () {
    self = this;
    this.healthplayer1.Update(this.player1._health);
    this.healthplayer2.Update(this.player2._health);
    this.ammoplayer1.Update(this.player1._ammo);
  

    this.middlepoint.x=(this.player1.x+this.player2.x)/2;
    this.middlepoint.y=(this.player1.y+this.player2.y)/2;

    this.players.forEach(function (player) {
      //colisiones jugadores, mapa
      self.game.physics.arcade.collide(player, self.layer);
      //actualizacion de estado del jugador
      player.update(self.shots);
      //Colisiones con tile pintado
      var offset=1;
      var TileWallRight= self.map.getTileWorldXY(player.body.x + player.body.width+offset, player.body.y+player.body.height/2);
      var TileWallLeft=self.map.getTileWorldXY(player.body.x-offset,  player.body.y+player.body.height/2);
      if (TileWallLeft!==null) player.Swim(TileWallLeft.index === player.color, -1);
      else if(TileWallRight!==null) player.Swim(TileWallRight.index === player.color, 1);
      else if(player.body.onFloor()){
        var TileGround = self.map.getTileWorldXY(player.body.x+player.body.width/2, player.body.y + player.body.height+offset);
        if(TileGround!==null) player.Swim(TileGround.index === player.color, 0);
      }
      else player.Swim(false, 0);
    
      //colisiones con disparos
      self.shots.forEachAlive(function (bullet) {
        if (bullet.color !== player.color) self.game.physics.arcade.collide(bullet, player, function () {
          player.Damage(bullet.Damage);
          bullet.kill();
        });
      });

    });

    //colisiones balas con mapa
    this.shots.forEachAlive(function (each) {
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
},{"./GaugeIcon.js":1,"./Inkling.js":2,"./Interface.js":3,"./Shot.js":4}]},{},[5]);
