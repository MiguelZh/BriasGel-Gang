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