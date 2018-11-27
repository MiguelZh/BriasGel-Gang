var Interface = function (game, x, y, sprite, height, width) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.smoothed=false;
    this.game.add.existing(this);
    this.height = height;
    this.width = width;
    this.anchor.setTo(0.5, 0.5);
}

Interface.prototype = Object.create(Phaser.Sprite.prototype);
Interface.prototype.constructor = Interface;

module.exports = Interface;