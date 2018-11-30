var Interface = require('./Interface.js');


var GaugeIcon = function (game, x, y, sprite, spriteempty, height, width, backgroundh, backgroundw, backgroundx, backgroundy, player) {
    this.player=player;
    this.sprite = sprite;
    this.spriteempty=spriteempty;
    this.backgroundheight=backgroundh;
    if (this.player.color === 2) this.backgroundsprite = 'backgroundor';
    else this.backgroundsprite = 'backgroundpu';
    this.background = new Interface(game, backgroundx, backgroundy, this.backgroundsprite, backgroundh, backgroundw);
    this.background.anchor.setTo(0,1)
    Interface.call(this, game, x, y, sprite, height, width);
    this.smoothed=false;
    this.anchor.setTo(0,1)
    this.game.add.existing(this.background);
    this.game.add.existing(this);
}
GaugeIcon.prototype = Object.create(Interface.prototype);
GaugeIcon.prototype.constructor = GaugeIcon;

GaugeIcon.prototype.Update = function (stat) {
    if (this.stat <= 0) this.loadTexture(this.spriteempty);
    else this.loadTexture(this.sprite);
    
    this.background.height = stat / 100 * this.backgroundheight;
}

module.exports = GaugeIcon;