'use strict'

var Inkling= function (game, x, y, sprite, speed, jump){
  //Atributos
  Phaser.Sprite.call(this, game, x, y, sprite);
  this._speed=speed;
  this._jump=jump;
  this._health=100;
  this._ammo=100;

  //Físicas
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds=true;
  this.body.collideWorldBounds;
  this.body.gravity.y=800;
  this.body.velocity.x=0;
  this.body.velocity.y=0;

  //Animaciones
  this.game.add.existing(this);
  this.frame=0;
  this.animations.add('idle',[0,1,2,3,4,5,6,7,8,9], 9, true);
  this.animations.add('jump', [10,11,12,13,14,15], 9, true);
  this.animations.add('run', [20,21,22,23,24,25,26,27], 9, true);
  this.animations.add('transform', [30,31,32,33,34], 9, true);
  this.animations.add('fall',[70,71],9,true);
  this.animations.add('ground',[80,81,82],9,true);
  this.anchor.setTo(.5,.5);
  this.scale.setTo(this.scale.x * 2, this.scale.y *2);
  
}
Inkling.prototype=Object.create(Phaser.Sprite.prototype);
Inkling.prototype.constructor=Inkling;

//Métodos Inkling

var suelo = true;
var aux ;
Inkling.prototype.update=function(){
  var dir=0;
  if(this.body.velocity.y ===0 && this.body.velocity.y <14 && this.body.velocity.y>13) suelo = true;
  else suelo = false;
  if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) dir=-1;
  else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) dir=1;
  this.Movement(dir);
  if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
    this.animations.play('transform', 9, false);
  } 
  else if(this.body.onFloor() && this.body.velocity.x===0 && !aux) this.animations.play('idle');
  else if(this.body.onFloor() && this.body.velocity.x !==0) this.animations.play('run');
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        if (this.body.onFloor())
        {
            this.body.velocity.y = -200*this._jump;
            this.animations.play('jump', 10, false);
        }
    }
  //if(suelo===false && this.body.velocity.y>0 ){this.animations.play('fall',5,false);aux =true;}
  //if(suelo === true && aux ===true ) {this.animations.play('ground',9,false);aux = false}
  console.log(this.body.velocity.y ===0 );
  
  }




Inkling.prototype.Movement=function (dir){
  if(this.scale.x*dir<0) this.scale.x=-this.scale.x;
  this.body.velocity.x=dir*this._speed;
}





var Inklingsprite;
var map; var layer;
  var PlayScene = {
  create: function () {
   Inklingsprite= new Inkling (this.game, this.game.world.centerX, 0, 'Inkling',400,3);
   map= this.game.add.tilemap('tilemap');
   map.addTilesetImage('tileset');
   layer= map.createLayer('Capa de Patrones 1');
   map.setCollision([1,2]);
   layer.resizeWorld();
   this.game.camera.follow(Inklingsprite);

   this.physics.startSystem(Phaser.Physics.ARCADE);
  
  },
  update: function () {
    Inklingsprite.update();
    this.game.physics.arcade.collide(Inklingsprite, layer);
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.O)) map.replace(1,2);
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)) map.replace(2,1);

  //console.log(Inklingsprite.body.velocity.y);
   
  
    



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


