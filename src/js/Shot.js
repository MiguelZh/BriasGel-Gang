'use strict'

var Shot=function(game){
   
    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, 'bullet');

    

    //Físicas
    this.game.physics.arcade.enable(this);

    
    this.body.outOfBoundsKill;
    
    //Sprite
    this.game.add.existing(this);
    this.anchor.setTo(0.5,0.5);
    this.scale.setTo(this.scale.x *1.2, this.scale.y *1.2);
    this.rotation=Math.atan((this.body.velocity.y)/this.body.velocity.x);
    
}
Shot.prototype=Object.create(Phaser.Sprite.prototype);
Shot.prototype.constructor=Shot;

//Atributos estáticos
Shot.prototype.Speed=700;
Shot.prototype.Fall=400;
Shot.prototype.Damage=10;

//Inicialización de la bala (llamada al salir del pool)
Shot.prototype.initialize=function(x, y,sprite,dir){
    this.body.velocity.y=0;//reseteo de la velocidad
    this.body.velocity.x=0;
    this.x=x;
    this.y=y;
    this.sprite=sprite;
    this.body.velocity.x=this.Speed*dir;
    if(this.body.velocity.x*this.scale.x<0) this.scale.x=this.scale.x*-1;
    this.body.gravity.y=this.Fall;
    
   
}


Shot.prototype.update=function(){
    //ajuste de rotación a la direccion de la bala
    this.rotation=Math.atan((this.body.velocity.y)/this.body.velocity.x);

}





module.exports= Shot;