'use strict'
var shot=require('./Shot.js')

 var Inkling=function (game, x, y, sprite, speed, jump){
    //Atributos
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.kidspeed=speed;
    this.squidspeed=this.kidspeed*0.5;
    this._speed=speed;
    this._jump=jump;
    this._health=100;
    this._ammo=100;
    this.iskid=true;
    this.shooting=false;
    this.nextfire=0;

  
    
    //Controles
    this.mrightkey=Phaser.Keyboard.RIGHT;
    this.mleftkey=Phaser.Keyboard.LEFT;
    this.jumpkey=Phaser.Keyboard.UP;
    this.transkey=Phaser.Keyboard.DOWN;
    this.shootkey=Phaser.Keyboard.A;
  
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
    this.animations.add('squididle', [60,61], 9, true);
    this.animations.add('movesquid', [60,61,62,63], 9, true);
    this.animations.add('fall', [70,71], 9, true);
    this.animations.add('shootidle', [41,42,43,44], 9, false);
    this.animations.add('shootrun', [50,51,52,53,54,55,56,57], 9, false);
    
  
    this.anchor.setTo(0.5,0.5);
    this.scale.setTo(this.scale.x * 2, this.scale.y *2);
    
  }
  Inkling.prototype=Object.create(Phaser.Sprite.prototype);
  Inkling.prototype.constructor=Inkling;
  
  //Atributos Estáticos
  Inkling.prototype.FireRate=200;
  

  //Métodos Inkling

  Inkling.prototype.update=function(Pool){
    var dir=0;
   
    //movimiento
    if(this.iskid) this._speed=this.kidspeed;
    else this._speed=this.squidspeed;
    if(this.game.input.keyboard.isDown(this.mrightkey)) dir=1;
    else if(this.game.input.keyboard.isDown(this.mleftkey)) dir=-1;
    this.Movement(dir);

    //Salto
    if(this.body.onFloor()&&this.game.input.keyboard.isDown(this.jumpkey)) this.body.velocity.y=this._jump;

    //transformación
    if(this.game.input.keyboard.isDown(this.transkey))this.iskid=false;
    else this.iskid=true;

    //disparo
    if(this.game.input.keyboard.isDown(this.shootkey) && this.iskid){
     this.shooting=true;
     this.Fire(Pool);
    }
    else this.shooting=false;

    //animar
    this.Animator();
    
  }
  
  Inkling.prototype.Animator=function()
  {
    //Animaciones del calamar
    if(!this.iskid){ 
      if(this.body.velocity.x===0 && this.body.velocity.y===0)
      this.animations.play('squididle', 3, false);
      else this.animations.play('movesquid', 9, true);
  }
  //Animaciones de la niña
    else
    {
      //Animaciones en el suelo
      if(this.body.onFloor())
      {
        if(this.game.input.keyboard.isDown(this.jumpkey)) this.animations.play('jump', 9, false);
        else{
        if(this.body.velocity.x===0) {
          if(!this.shooting)
          this.animations.play('idle');
          else this.animations.play('shootidle', 9, true);
        }
        else{ 
          if(!this.shooting) this.animations.play('run');
          else this.animations.play('shootrun', 9, true);
      }
    }
        
      }
      //Animaciones en el aire
      else {
      if(this.body.velocity.y>=0 && !this.shooting)
      {
       this.animations.play('fall', 9, false);
      }
      else if(this.shooting) this.animations.play('shootidle');
    }
  
  }
}
  
  Inkling.prototype.Movement=function (dir)
  {
    if(this.scale.x*dir<0) this.scale.x=-this.scale.x;//cambio de orientación de sprite
    this.body.velocity.x=dir*this._speed;
  }

  Inkling.prototype.Damage=function(damage){
    this._health=this._health-damage;//ser dañado
  }

  
  Inkling.prototype.Fire= function(Pool){
    var velocitymul;//aumento de velocidad de la bala si se esta moviendo

    if(this.game.time.now>this.nextfire){//si ha pasado suficiente tiempo entre disparos
      this.nextfire=this.game.time.now + this.FireRate;
    if(this.body.velocity.x!==0)  velocitymul=1.2;
    else velocitymul=1;
    if(this.scale.x<0){
     Pool.spawn(this.x-this.scale.x-60,this.y,'bullet',-1*velocitymul);//disparo hacia la izquierda
      }
    else{ 

     Pool.spawn(this.x+this.scale.x+60,this.y,'bullet',1*velocitymul);//disparo hacia la derecha
      }
    }
  }





module.exports=Inkling;