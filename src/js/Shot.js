'use strict'

var Shot=function(game){
   
    Phaser.Sprite.call(this, game, 0, 0, 'bullet');
    
    

    //Físicas
    this.game.physics.arcade.enable(this);
    this.body.gravity.y=0;
    this.body.velocity.x=0;
    this.body.velocity.y=0
    this.body.outOfBoundsKill;
    
    //Sprite
    this.game.add.existing(this);
    this.anchor.setTo(0.5,0.5);
    this.scale.setTo(this.scale.x *1.2, this.scale.y *1.2);
    this.rotation=Math.atan((this.body.velocity.y)/this.body.velocity.x);
    
}
Shot.prototype=Object.create(Phaser.Sprite.prototype);
Shot.prototype.constructor=Shot;

Shot.prototype.Damage=10;

Shot.prototype.initialize=function(sprite,speed,fall){
    this.sprite=sprite;
    this.body.velocity.x=speed;
    this.body.gravity.y=fall;
}


Shot.prototype.update=function(){
    this.rotation=Math.atan((this.body.velocity.y)/this.body.velocity.x);
    if(this.body.velocity.x<0) this.scale.x=-this.scale.x;
}





module.exports= Shot;