'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.spritesheet('Inklingo', 'images/SpriteSheetInkling.png', 50, 53);
    this.game.load.spritesheet('Inklingp', 'images/SpriteSheetInkling2.png', 50, 53);
    this.game.load.tilemap('tilemap', 'images/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tileset', 'images/tileset.png');
    this.game.load.image('bulleto', 'images/BalaPintura.png');
    this.game.load.image('bulletp', 'images/BalaPintura2.png');
    this.game.load.image('hud', 'images/FondoInterfaz.png');
    this.game.load.image('backgroundor', 'images/OrangeBackground.png');
    this.game.load.image('backgroundpu', 'images/PurpleBackground.png');
    this.game.load.image('healthind', 'images/HealthIcon.png');
    this.game.load.image('deadicon', 'images/F.png');
  

  },

  create: function () {
    this.game.state.start('play');

  }
};

//800, 600, Phaser.AUTO, 'game',true, false, false
window.onload = function () {
  var game = new Phaser.Game({
    width: 800,
    height: 600,
    parent: 'game',
    input: {
      gamepad: true,
    },
  });

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};










































