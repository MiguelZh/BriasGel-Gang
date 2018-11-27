var Interface = require('./Interface.js');


var HealthIcon = function (game, x, y, spritealive, spritedead, height, width, player) {
    this.player = player;
    this.spritealive = spritealive;
    this.spritedead = spritedead;
    if (this.player.color === 2) this.backgroundsprite = 'backgroundor';
    else this.backgroundsprite = 'backgroundpu';
    this.background = new Interface(game, x, y, this.backgroundsprite, height, width);
    this.background.anchor.setTo(0,1)
    Interface.call(this, game, x, y, spritealive, height, width);
    this.smoothed=false;
    this.anchor.setTo(0,1)
    this.game.add.existing(this.background);
    this.game.add.existing(this);

}
HealthIcon.prototype = Object.create(Interface.prototype);
HealthIcon.prototype.constructor = HealthIcon;

HealthIcon.prototype.Update = function () {
    if (this.player._health <= 0)
        this.loadTexture(this.spritedead);
    else this.loadTexture(this.spritealive);
    this.background.height = this.player._health / 100 * this.height;
}

/*
var AmmoIcon=function(game, x, y, sprite, height, width, player){
    this.player = player;
    if (this.player.color === 2) this.backgroundsprite = 'backgroundor';
    else this.backgroundsprite = 'backgroundpu';
    this.background = new Interface(game, x, y, this.backgroundsprite, height, width);
    this.background.anchor.setTo(0,1)
    Interface.call(this, game, x, y, sprite, height, width);
    this.smoothed=false;
    this.anchor.setTo(0,1)
    this.game.add.existing(this.background);
    this.game.add.existing(this);
}

AmmoIcon.prototype=Object.create(Interface.prototype);
AmmoIcon.prototype.constructor=AmmoIcon;

AmmoIcon.prototype.Update=function(){
    this.background.height=this.player._ammo/100 * this.height;
}
*/

module.exports = HealthIcon;
//module.exports= AmmoIcon;