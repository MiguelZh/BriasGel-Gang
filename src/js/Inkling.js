'use strict'
 var Inkling=function (game, x, y, sprite, speed, jump){
    //Atributos
    Phaser.Sprite.call(this, game, x, y, sprite);
    this._speed=speed;
    this._jump=jump;
    this._health=100;
    this._ammo=100;
  
    this.iskid=true;
  
    
    //Controles
    this.mrightkey=Phaser.Keyboard.RIGHT;
    this.mleftkey=Phaser.Keyboard.LEFT;
    this.jumpkey=Phaser.Keyboard.UP;
    this.transkey=Phaser.Keyboard.DOWN;
    this.shootkey=Phaser.Keyboard.SPACE;
  
    //Físicas
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds=true;
    this.body.gravity.y=800;
    this.body.velocity.x=0;
    this.body.velocity.y=0;
  
    //Animaciones
    this.game.add.existing(this);
    this.frame=0;
    this.animations.add('idle',[0,1,2,3,4,5,6,7,8,9], 9, true);
    this.animations.add('jump', [10,11,12,13,14,15], 9, false);
    this.animations.add('run', [20,21,22,23,24,25,26,27], 9, true);
    this.animations.add('transform', [30,31,32,33,34], 9, false);
    this.animations.add('detransform', [34,33,32,31,30], 9, true);
    this.animations.add('movesquid', [60,61,62,63], 9, true);
    this.animations.add('fall', [70,71], 9, true);
    this.currentAnimation ='idle';
    
  
    this.anchor.setTo(.5,.5);
    this.scale.setTo(this.scale.x * 2, this.scale.y *2);
    
  }
  Inkling.prototype=Object.create(Phaser.Sprite.prototype);
  Inkling.prototype.constructor=Inkling;
  
  //Métodos Inkling
  
  Inkling.prototype.update=function(){
    var dir=0;
    //movimiento
    if(this.game.input.keyboard.isDown(this.mrightkey)) dir=1;
    else if(this.game.input.keyboard.isDown(this.mleftkey)) dir=-1;
    this.Movement(dir);
    //Salto
    if(this.body.onFloor()&&this.game.input.keyboard.isDown(this.jumpkey)) this.body.velocity.y=this._jump;
    //transformación
    if(this.game.input.keyboard.isDown(this.transkey)) this.iskid=false;
    else this.iskid=true;
    //animar
    this.Animator();
  }
  
  Inkling.prototype.Animator=function()
  {
    if(!this.iskid) this.animations.play('movesquid', 9, false);
    else
    {
      if(this.body.onFloor())
      {
        if(this.body.velocity.x===0) this.animations.play('idle');
        else this.animations.play('run');
      }
      else
      {
        if(this.body.velocity.y<=0) this.animations.play('jump', 9, false);
        else this.animations.play('fall', 9, false);
      }
    }
  }
  
  Inkling.prototype.Movement=function (dir, dt)
  {
    if(this.scale.x*dir<0) this.scale.x=-this.scale.x;
    this.body.velocity.x=dir*this._speed;
  
  }
module.exports=Inkling;