'use strict'

var Shot=function(game, x, y, sprite, speedx, speedy){
    Phaser.Sprite.call(this, game, x, y, sprite)
    this.speedx=speedx;
    this.speedy=speedy;

    //Físicas
    this.game.physics.arcade.enable(this);
    this.body.gravity.y=100;
    this.body.velocity.x=speedx;
    this.body.velocity.y=speedy;
    this.body.outOfBoundsKill;
    
    //Sprite
    this.game.add.existing(this);
    this.anchor.setTo(0,0.5);
    this.scale.setTo(this.scale.x * 1.2, this.scale.y *1.2);
}
Shot.prototype=Object.create(Phaser.Sprite.prototype);
Shot.prototype.constructor=Shot;

Shot.prototype.Damage=10;

Shot.prototype.Destroy=function(){
    this.destroy();
}





module.exports= Shot;1