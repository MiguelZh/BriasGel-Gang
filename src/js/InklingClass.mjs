


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
    this.anchor.setTo(.5,.5);
    this.scale.setTo(this.scale.x * 2, this.scale.y *2);
    
  }
  Inkling.prototype=Object.create(Phaser.Sprite.prototype);
  Inkling.prototype.constructor=Inkling;
  
  //Métodos Inkling
  
  Inkling.prototype.update=function(){
    var dir=0;
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) dir=-1;
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) dir=1;
    this.Movement(dir);
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
      {
          if (this.body.onFloor())
          {
              this.body.velocity.y = -200*this._jump;
          }
      }
    this.animationshandler();
   
  }
  
  Inkling.prototype.animationshandler=function(){
    if(this.body.onFloor()){
       if(this.body.velocity.x===0)this.animations.play('idle');
       else this.animations.play('run');
    }
  }
  
  Inkling.prototype.Movement=function (dir){
    if(this.scale.x*dir<0) this.scale.x=-this.scale.x;
    this.body.velocity.x=dir*this._speed;
  }
  
  