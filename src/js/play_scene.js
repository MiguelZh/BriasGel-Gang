'use strict';

  var PlayScene = {
  create: function () {

    var Inklingsprite =this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'IdleAnimation');
    Inklingsprite.frame=9;
    Inklingsprite.animations.add('idle', [0,1,2,3,4,5,6,7,8,9], 10, true);
    Inklingsprite.animations.play('idle');  
  }
};

module.exports = PlayScene;
