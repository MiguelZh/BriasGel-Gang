'use strict'
var shot = require('./Shot.js')

var Inkling = function (game, x, y, sprite, speed, jump, RIGHT, LEFT, JUMP, SWIM, SHOOT, color) {
  //Atributos
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.kidspeed = speed;
  this.squidspeed = speed * 0.5;
  this.swimspeed = speed * 1.95;
  this._speed = speed;
  this._jump = jump;
  this._health = 100;
  this._ammo = 100;
  this.iskid = true;
  this.shooting = false;
  this.isswimming = false;
  this.nextfire = 0;
  this.timeheals = 0;
  this.timerecharge = 0;
  this.hittime;
  this.color = color;



  //Controles
  this.mrightkey = RIGHT;
  this.mleftkey = LEFT;
  this.jumpkey = JUMP;
  this.transkey = SWIM;
  this.shootkey = SHOOT;

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


  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(this.scale.x * 1.1, this.scale.y * 1.1);


}
Inkling.prototype = Object.create(Phaser.Sprite.prototype);
Inkling.prototype.constructor = Inkling;

//Atributos Estáticos
Inkling.prototype.FireRate = 200;
Inkling.prototype.RegenRate = 500;
Inkling.prototype.RegenLatency = 1000;
Inkling.prototype.RechargeRate = 200;


//Métodos Inkling

Inkling.prototype.update = function (Pool) {
  var dir = 0;

  //movimiento
  if (this.iskid || !this.body.onFloor()) this._speed = this.kidspeed;
  else if (!this.isswimming) this._speed = this.squidspeed;
  else this._speed = this.swimspeed;

  if (this.game.input.keyboard.isDown(this.mrightkey)) dir = 1;
  else if (this.game.input.keyboard.isDown(this.mleftkey)) dir = -1;
  this.Movement(dir);

  //Salto
  if (this.body.onFloor() && this.game.input.keyboard.isDown(this.jumpkey)) this.body.velocity.y = this._jump;

  //transformación
  if (this.game.input.keyboard.isDown(this.transkey)) this.iskid = false;
  else this.iskid = true;



  //disparo
  if (this.game.input.keyboard.isDown(this.shootkey) && this.iskid) {
    this.shooting = true;
    this.Fire(Pool);
  }
  else this.shooting = false;

  if (this.isswimming) this.Recharge();
  //animar
  this.Animator();
  this.HurtBoxShift();
  this.Heal();
}

Inkling.prototype.Swim = function (bool) {
  this.isswimming = bool && !this.iskid;
}

Inkling.prototype.HurtBoxShift = function () {
  if (!this.iskid) {
    if (this.isswimming) this.body.setSize(30, 3, 5, 50);
    else this.body.setSize(30, 7, 10, 45);
  }
  else this.body.setSize(30, 42, 10, 11);

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
      if (this.body.velocity.x === 0) this.animations.play('swimidle', 3, false);
      else this.animations.play('swim', 9, true);
    }
  }
  //Animaciones de la niña
  else {
    //Animaciones en el suelo
    if (this.body.onFloor()) {
      if (this.game.input.keyboard.isDown(this.jumpkey)) this.animations.play('jump', 9, false);
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
  if (this.scale.x * dir < 0) this.scale.x = -this.scale.x;//cambio de orientación de sprite
  this.body.velocity.x = dir * this._speed;
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
  this.timeheals = this.game.time.now;
  this.hit = this.game.time.now;
}

Inkling.prototype.AmmoDecrease = function () {
  this._ammo -= 5;
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
  if (this._ammo > 0) {
    if (this.game.time.now > this.nextfire) {//si ha pasado suficiente tiempo entre disparos
      this.nextfire = this.game.time.now + this.FireRate;
      this.AmmoDecrease();

      if (this.scale.x < 0) {
        Pool.spawn(this.x - this.scale.x, this.y, 'bullet', -1, this.color);//disparo hacia la izquierda
      }
      else {
        Pool.spawn(this.x + this.scale.x, this.y, 'bullet', 1);//disparo hacia la derecha
      }
    }
  }
}





module.exports = Inkling;