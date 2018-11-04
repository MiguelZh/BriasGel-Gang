'use strict'

var Inkling = require('./Inkling.js');
var shot= require('./Shot.js');
var Inklingsprite;
var map; var layer;
var nextfire=0;
   var firerate=200;
  var PlayScene = {
  create: function () {

   Inklingsprite= new Inkling (this.game, this.game.world.centerX, 0, 'Inkling',400,-600);
   map= this.game.add.tilemap('tilemap');
   map.addTilesetImage('tileset');
   layer= map.createLayer('Capa de Patrones 1');
   map.setCollision([1,2]);
   layer.resizeWorld();
   this.game.camera.follow(Inklingsprite);
   this.physics.startSystem(Phaser.Physics.ARCADE);
   
   
  },
  update: function () {
    this.game.physics.arcade.collide(Inklingsprite, layer);
    Inklingsprite.update();
    if(this.game.input.keyboard.isDown(Inklingsprite.shootkey)&& this.game.time.now>nextfire) {nextfire=this.game.time.now+firerate;
       var bullet = new shot(this.game, Inklingsprite.x , Inklingsprite.y, 'bullet', +700*Inklingsprite.scale.x, 0)}
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.O)) map.replace(1,2);
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)) map.replace(2,1);
  }


  
  
};

/*

var Inkling= function (position, sprite, color, size, health, ink, player){
  this._position=position;
  this._sprite=sprite;
  this._color=color;
  this._size=size;
  this._health=health;
  this._ink=ink;
  this._player=player;
}
Inkling.prototype.Movement=function(){};
Inkling.prototype.Die=function(){};
Inkling.prototype.Respawn=function(){};
Inkling.prototype.Transform=function(){};
Inkling.prototype.Jump=function(){};
Inkling.prototype.Damage=function(){};


var Kid= function (position, sprite, color, size, health, ink, player,aimpoint){
  Inkling.apply(this,[position, sprite, color, size, health, ink, player]);
  this._aimpoint= aimpoint;
}

Kid.prototype= Object.create(Inkling.prototype);
Kid.prototype.constructor=Kid;

Kid.prototype.Shoot=function(){};
Kid.prototype.Aim=function(){};


var Squid =function(position, sprite, color, size, health, ink, player){
  Inkling.apply(this,[position, sprite, color, size, health, ink, player]);
}
Squid.prototype=Object.create(Inkling.prototype);
Squid.prototype.constructor=Squid;

Squid.prototype.Recharge=function(){};
Squid.prototype.Swim=function(){};
//modificar algunas funciones de Inkling








var Platform = function(position, size, color, sprite){
  this._position=position;
  this._size=size;
  this._color=color;
  this._sprite=sprite;
}

Platform.prototype.ChangeColor=function(){};


var MobilePlatform= function(position, size, color, sprite, direction, speed){
  Platform.apply(this, [position, size, color, sprite]);
  this._direction=direction;
  this._speed=speed;
}

MobilePlatform.prototype=Object.create(Platform.prototype);
MobilePlatform.prototype.constructor=MobilePlatform;

MobilePlatform.prototype.Move=function(){};


var Grilles= function(position, size, color, sprite){
  Platform.apply(this, [position, size, color, sprite]);
}

Grilles.prototype=Object.create(Platform.prototype);
Grilles.prototype.constructor=Grilles;
Grilles.prototype.Cross= function(){};







var Spawn= function(position, size, color, sprite){
  this._position=position;
  this._size=size;
  this._color=color;
  this._sprite=sprite;
}

Spawn.prototype.GiveInvulnerability=function(){};








var Shot=function(position,color,sprite,direction){
  this._position=position;
  this._color=color;
  this._sprite=sprite;
  this._direction=direction;
}

Shot.prototype._bulletsize=x;
Shot.prototype.Movement=function(){};
Shot.prototype.Impact=function(){};
*/

module.exports = PlayScene;


