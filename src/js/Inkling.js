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