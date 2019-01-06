'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'assets/sprites/preloader_bar.png');
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
    this.game.load.image('logo', 'assets/sprites/phaser.png');
    this.game.load.spritesheet('Inklingo', 'assets/sprites/SpriteSheetInkling.png', 50, 53);
    this.game.load.spritesheet('Inklingp', 'assets/sprites/SpriteSheetInkling2.png', 50, 53);
    this.game.load.tilemap('tilemap', 'assets/tilemap/tilemap3.Json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tileset', 'assets/tileset/tileset.png');
    this.game.load.image('bulleto', 'assets/sprites/BalaPintura.png');
    this.game.load.image('bulletp', 'assets/sprites/BalaPintura2.png');
    this.game.load.image('hud', 'assets/sprites/FondoInterfaz.png');
    this.game.load.image('backgroundor', 'assets/sprites/OrangeBackground.png');
    this.game.load.image('backgroundpu', 'assets/sprites/PurpleBackground.png');
    this.game.load.image('healthind', 'assets/sprites/HealthIcon.png');
    this.game.load.image('deadicon', 'assets/sprites/F.png');
    this.game.load.image('ammoind', 'assets/sprites/InkTank.png');
    this.game.load.image('pausebutton', 'assets/sprites/button_return-to-main-menu.png');
    //load sounds/music
    this.game.load.audio('backgroundMusic','assets/audio/Splatoon_2_Fly_Octo_Fly.mp3');
    this.game.load.audio('shootInk0','assets/audio/sounds/inkHitSplash00.wav');
    this.game.load.audio('shootInk1','assets/audio/sounds/inkHitSplash01.wav');
    this.game.load.audio('shootInk2','assets/audio/sounds/inkHitSplash02.wav');
    this.game.load.audio('shootInk3','assets/audio/sounds/inkHitSplash03.wav');
    this.game.load.audio('shootInk4','assets/audio/sounds/noAmmo.mp3');
    this.game.load.audio('endSound','assets/audio/sounds/gameFinish.wav');
    this.game.load.audio('step','assets/audio/sounds/step.wav');
    this.game.load.audio('swim','assets/audio/sounds/swim.wav');
    this.game.load.audio('jump','assets/audio/sounds/jump.mp3');
    this.game.load.audio('countdown','assets/audio/sounds/countdownTimer.mp3');


  },

  create: function () {
    this.game.state.start('menu');
  }
};

var MenuScene = {
  preload:function(){
      //load menu assets
      this.game.load.image('menuImage','assets/menu/TitleScreen.png');
      this.game.load.audio('menuMusic','assets/menu/MenuMusic.mp3');
  },
  create:function(){
    this.title = this.game.add.sprite(0,0,'menuImage');
    this.title.inputEnabled = true;
    this.enterText = this.game.add.text(250,this.game.world.height-80,'Press Enter to play!',{font: '40px Times New Roman', fill: 'white', stroke: 'black', strokeThickness: 10})
    var inputKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    inputKey.onDown.addOnce(this.start,this);
    this.music = this.game.add.sound('menuMusic');
    this.title.events.onInputDown.add(function(){
    if(this.context === undefined){
    this.context=new AudioContext;
    
    this.music.loop = true;
    this.music.volume=0.5;
    this.music.play();
    }
  }, this);
    
  },
  start: function(){
    this.game.state.start('play');
    this.music.stop();
  }
}
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
  game.state.add('menu',MenuScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};










































