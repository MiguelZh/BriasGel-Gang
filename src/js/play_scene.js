'use strict';
var Inkling= function (game, x, y, sprite, speed, jump){
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.speed=speed;
  this.game.physics.arcade.enable(this);
  this.cursors=this.game.input.keyboard.createCursorKeys();
  this.jump=jump;
  this.health=100;
  this.ammo=100;


}
Inkling.prototype=Object.create(Phaser.Sprite.prototype);
Inkling.prototype.constructor=Inkling;

Inkling.prototype.update=function(){
  var dir=0;
  if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) dir=-1;
  else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) dir=1;
  this.Movement(dir);

}

Inkling.prototype.Movement=function (dir){
  if(this.scale.x*dir<0) this.scale.x=-this.scale.x;
  this.body.velocity.x=dir*this.speed;
}





var Inklingsprite;

  var PlayScene = {
  create: function () {
   Inklingsprite= new Inkling (this.game, this.game.world.centerX, this.game.world.centerY, 'IdleAnimation',200,0);
   this.game.add.existing(Inklingsprite);
   Inklingsprite.anchor.setTo(.5,.5);
   Inklingsprite.scale.setTo(Inklingsprite.scale.x * 5, Inklingsprite.scale.y *5);
   Inklingsprite.frame=0;
   Inklingsprite.animations.add('idle', [0,1,2,3,4,5,6,7,8,9], 9, true);
   Inklingsprite.animations.play('idle');
   
  this.physics.startSystem(Phaser.Physics.ARCADE);
  Inklingsprite.body.gravity.y=800;
  Inklingsprite.body.collideWorldBounds=true;
  Inklingsprite.body.bounce.y=0.5;
  Inklingsprite.body.bounce.x=0.5;
  

  },
  update: function () {
    Inklingsprite.update();



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


