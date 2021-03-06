'use strict'

//clase pool 

function ShotsPool(game, entities) {
  this._group = game.add.group();
  this._group.addMultiple(entities);
  this._group.callAll('kill');
}

ShotsPool.prototype.spawn = function (x, y, sprite, dir, angle, color) {
  var entity = this._group.getFirstExists(false);
  if (entity) {
    entity.initialize(x, y, sprite, dir, angle, color);
    entity.revive();
  }
  return entity;
}

ShotsPool.prototype.forEachAlive = function (funcion) {
  this._group.forEachAlive(funcion);
}

var Inkling = require('./Inkling.js');
var Interface = require('./Interface.js');
var GaugeIcon = require('./GaugeIcon.js');
var shot = require('./Shot.js');

var PlayScene = {
  ////////CREATE//////////
  create: function () {
     this.backgroundImage = this.game.add.tileSprite(275,0,800,600,'gameBackground');
    //creacion de array de balas
    var bullets = [];
    for (var i = 0; i < 50; i++) {
      bullets.push(new shot(this.game));
      bullets[i].kill();
    }
    //creacion del pool de balas 
    this.shots = new ShotsPool(this.game, bullets);
    //creacion del audio
    this.backgroundSound = this.game.add.audio('backgroundMusic');
    this.backgroundSound.loop = true;
    this.backgroundSound.volume=0.7;
    this.backgroundSound.play();
    //creacion del mapa
   
    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Capa de Patrones 1');
    this.map.setCollision([1, 2]);

    
    //creacion de jugadores
    this.player1 = new Inkling(this.game, this.game.world.centerX + 350, 0, 'Inklingo', 300, -400, Phaser.Keyboard.D, Phaser.Keyboard.A, Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.P, Phaser.Keyboard.O, 2,false);
    this.player2 = new Inkling(this.game, this.game.world.centerX - 350, 0, 'Inklingp', 300, -400, Phaser.Gamepad.XBOX360_DPAD_LEFT , Phaser.Gamepad.XBOX360_STICK_LEFT_X, Phaser.Gamepad.XBOX360_DPAD_UP , Phaser.Gamepad.XBOX360_DPAD_DOWN ,  Phaser.Gamepad.XBOX360_X, Phaser.Keyboard.G, Phaser.Keyboard.F, 3,true);
    this.player1.scale.x=-this.player1.scale.x;
    //creacion de interfaz
    var margin=this.game.height-10;
    var backgroundhud = new Interface(this.game, this.game.world.centerX, margin-20, 'hud', 60, 230);
    backgroundhud.anchor.setTo(0.5, 0.5);

    //Pantalla de resultados
    this.backgroundresults=new Interface(this.game, this.game.world.centerX, this.game.world.centerY, 'hud', 400, 500);
    this.backgroundresults.anchor.setTo(0.5, 0.5);
    this.backgroundresults.visible=false;
    var winnerpos=50;
    this.winnerText=this.game.add.text(this.backgroundresults.x, this.backgroundresults.y-winnerpos, 'Player1 Wins');
    this.winnerText.anchor.setTo(0.5,0.5);
    this.winnerText.font= 'Arial Black';
    this.winnerText.fontSize=40;
    this.winnerText.fill='orange';
    this.winnerText.visible=false;
    var separation=120;
    this.player1results=this.game.add.text(this.backgroundresults.x -separation, this.winnerText.y+separation, 'Player1: 2000pts');
    this.player1results.anchor.setTo(0.5,0.5);
    this.player1results.font= 'Arial Black';
    this.player1results.fontSize=20;
    this.player1results.fill='orange';
    this.player2results=this.game.add.text(this.backgroundresults.x +separation, this.winnerText.y+separation, 'Player2: 1000pts');
    this.player2results.anchor.setTo(0.5,0.5);
    this.player2results.font= 'Arial Black';
    this.player2results.fontSize=20;
    this.player2results.fill='purple';
    this.player1results.visible=false;
    this.player2results.visible=false;


    //Timer
    this.timeInSeconds=120;
    var backgroundTimer=new Interface(this.game, this.game.world.centerX + 300, margin-20, 'hud', 30, 150)
    backgroundTimer.anchor.setTo(0.5, 0.5);
    this.timeText=this.game.add.text(backgroundTimer.x,margin-20,'2:00');
    this.timeText.anchor.setTo(0.5,0.5);
    this.timeText.font = 'Arial Black';
    this.timeText.fontSize = 20;
    this.timeText.fontWeight = 'bold';
    this.timeText.fill = 'white';
    this.timer=this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);
      



     this.healthplayer1 = new GaugeIcon(this.game, backgroundhud.x - 60, margin, 'healthind', 'deadicon', 45, 40, 45, 40, backgroundhud.x - 60, margin, this.player1);
     this.healthplayer2 = new GaugeIcon(this.game, backgroundhud.x + 20, margin, 'healthind', 'deadicon', 45, 40, 45, 40, backgroundhud.x + 20, margin, this.player2);
     this.ammoplayer1= new GaugeIcon(this.game, backgroundhud.x - 105, margin, 'ammoind', 'ammoind', 40, 20, 30, 20, backgroundhud.x - 105, margin-5, this.player1);
     this.ammoplayer2= new GaugeIcon(this.game, backgroundhud.x + 85, margin, 'ammoind', 'ammoind', 40, 20, 30, 20, backgroundhud.x + 85, margin-5, this.player2);

    //guardado en array de jugadores
    this.players=[];
    this.players.push(this.player1);
    this.players.push(this.player2);

    //activacion del sistema de físicas
    this.physics.startSystem(Phaser.Physics.Arcade);


    this.PausedText=this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'PAUSE');
    this.PausedText.font='Arial Black';
    this.PausedText.fontSize=40;
    this.PausedText.fill='white';
    this.PausedText.stroke= 'black';
    this.PausedText.strokeThickness=10;
    this.PausedText.anchor.setTo(0.5,0.5);
    this.PausedText.visible=false;

    var buttonofset=50;
    this.pausebutton=this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + buttonofset, 'pausebutton');
    this.pausebutton.x=this.pausebutton.x - this.pausebutton.width/2;
    this.pausebutton.visible=false;
    
    
    this.pausekey= this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.pausekey.onDown.add(this.unpause, this);
    this.click=this.game.input;
    this.game.input.onDown.add(this.returntoMenu, this);


  },

  returntoMenu: function(){
   
    
    if(this.game.paused){
      console.log(this.click.x)
      if(this.click.x>this.pausebutton.x && this.click.x<this.pausebutton.x+this.pausebutton.width && this.click.y>this.pausebutton.y && this.click.y<this.pausebutton.y+this.pausebutton.height) {
        this.game.sound.stopAll();
        this.game.state.start('menu');
        this.game.paused=false;
      }
    }
},

  ////////UPDATE/////////
  update: function () {
    self = this;
    this.healthplayer1.Update(this.player1._health);
    this.healthplayer2.Update(this.player2._health);
    this.ammoplayer1.Update(this.player1._ammo);
    this.ammoplayer2.Update(this.player2._ammo);

    this.backgroundImage.tilePosition.y += 5;

    this.players.forEach(function (player) {
      //colisiones jugadores, mapa
      self.game.physics.arcade.collide(player, self.layer);
       //Colisiones con tile pintado
       var offset=2;
       var TileWallRight= self.map.getTileWorldXY(player.body.x+player.body.width+offset, player.body.y+player.body.height/2);
       var TileWallLeft=self.map.getTileWorldXY(player.body.x-offset,  player.body.y+player.body.height/2);
       var TileWallMiddle=self.map.getTileWorldXY(player.body.x+player.body.width/2,  player.body.y+player.body.height/2);
     
       if(player.scale.x>0){
        if(TileWallMiddle!==null){
          player.Swim(TileWallMiddle.index === player.color, 1,  TileWallMiddle);
        }
        else if(TileWallRight!==null){
          player.Swim(TileWallRight.index ===player.color, 1, TileWallRight);
        }
        else if(player.body.onFloor()){
          var TileGround = self.map.getTileWorldXY(player.body.x+player.body.width/2, player.body.y + player.body.height+offset);
          if(TileGround!==null) player.Swim(TileGround.index === player.color, 0,  TileGround);
        }
        else player.Swim(false, 0);
       }
       else if(player.scale.x<0){
        if(TileWallLeft!==null){
          player.Swim(TileWallLeft.index ===player.color, -1, TileWallLeft);
        }
        else if(TileWallMiddle!==null){
          player.Swim(TileWallMiddle.index === player.color, -1,  TileWallMiddle);
        }
         
        else if(player.body.onFloor()){
          var TileGround = self.map.getTileWorldXY(player.body.x+player.body.width/2, player.body.y + player.body.height+offset);
          if(TileGround!==null) player.Swim(TileGround.index === player.color, 0,  TileGround);
        }
        else player.Swim(false, 0);
       }
     
      //actualizacion de estado del jugador
      player.update(self.shots);
      //colisiones con disparos
      self.shots.forEachAlive(function (bullet) {
        if (bullet.color !== player.color) self.game.physics.arcade.collide(bullet, player, function () {
          player.Damage(bullet.Damage);
          bullet.kill();
        });
      });

    });

    //colisiones balas con mapa
    this.shots.forEachAlive(function (each) {
      var TileOnSpawn = self.map.getTileWorldXY(each.x, each.y);
      if (TileOnSpawn !== null) {
        self.map.replace(TileOnSpawn.index, each.color, TileOnSpawn.x, TileOnSpawn.y, 1, 1, self.layer);
        each.kill();
      }
      else {self.game.physics.arcade.collide(each, self.layer, function () {
        var dir = 0;
        if (each.scale.x >= 0) dir = 1;
        else if (each.scale.x < 0) dir = -1;

        //pintar tile(cambia el index del tile por uno de color)
        var TileCollided = self.map.getTileWorldXY(each.x + dir * self.map.tileWidth, each.y);
        var TileCollided2 = self.map.getTileWorldXY(each.x + dir * self.map.tileWidth, each.y + each.height / 2 + 10);
        var TileCollided3 = self.map.getTileWorldXY(each.x + dir * self.map.tileWidth, each.y - each.height / 2 - 10);
        var TileCollided4 = self.map.getTileWorldXY(each.x + each.width / 2 + 5, each.y + each.height / 2 + 10);
        var TileCollided5 = self.map.getTileWorldXY(each.x + each.width / 2 + 5, each.y - each.height / 2 - 10);
        var TileCollided6 = self.map.getTileWorldXY(each.x - each.width / 2 - 5, each.y + each.height / 2 + 10);
        var TileCollided7 = self.map.getTileWorldXY(each.x - each.width / 2 - 5, each.y - each.height / 2 - 10);

        if (TileCollided !== null) self.map.replace(TileCollided.index, each.color, TileCollided.x, TileCollided.y, 1, 1, self.layer);
        if (TileCollided2 !== null) self.map.replace(TileCollided2.index, each.color, TileCollided2.x, TileCollided2.y, 1, 1, self.layer);
        if (TileCollided3 !== null) self.map.replace(TileCollided3.index, each.color, TileCollided3.x, TileCollided3.y, 1, 1, self.layer);
        if (TileCollided4 !== null) self.map.replace(TileCollided4.index, each.color, TileCollided4.x, TileCollided4.y, 1, 1, self.layer);
        if (TileCollided5 !== null) self.map.replace(TileCollided5.index, each.color, TileCollided5.x, TileCollided5.y, 1, 1, self.layer);
        if (TileCollided6 !== null) self.map.replace(TileCollided6.index, each.color, TileCollided6.x, TileCollided6.y, 1, 1, self.layer);
        if (TileCollided7 !== null) self.map.replace(TileCollided7.index, each.color, TileCollided7.x, TileCollided7.y, 1, 1, self.layer);
        each.kill();
      });
    }
    });

   

  },
  paintedTilesCounter: function(){
    var player1tiles=0;
    var player2tiles=0;
    var self= this;
    this.map.forEach(function(tile){
      if(tile.index===self.player1.color) player1tiles++;
      else if(tile.index===self.player2.color)player2tiles++;
    });
  
    this.player1points=player1tiles* 10;
    this.player2points=player2tiles *10;
  },

  updateTimer: function(){
    if(this.timeInSeconds>0){
    this.timeInSeconds--;
    var minutes = Math.floor(this.timeInSeconds / 60);
    var seconds = this.timeInSeconds - (minutes * 60);
    var timeString = this.addZeros(minutes) + ":" + this.addZeros(seconds);
    this.timeText.text = timeString;
    }

    if (this.timeInSeconds == 15) {
      this.backgroundSound.stop();
      this.countdown = this.game.add.audio('countdown');
      this.countdown.volume = 0.7;
        this.countdown.play();
    }

    if (this.timeInSeconds == 0) {
        this.timeInSeconds--;
        this.sound = this.game.add.audio('endSound');
        this.sound.play();
        this.paintedTilesCounter();
        this.ShowResults();
        
    }
    else if(this.timeInSeconds<0){
      if(this.timeInSeconds<=-5){
        this.game.sound.stopAll();
        this.game.state.start('menu');
      }
      else
      this.timeInSeconds--;
    }
  },

  ShowResults: function(){
      this.backgroundresults.visible=true;
      if(this.player1points>this.player2points){
      this.winnerText.text='Player1 Wins';
      this.winnerText.fill='orange';
      }
      else if(this.player2points>this.player1points){
        this.winnerText.text='Player2 Wins';
        this.winnerText.fill='purple';
      }
      else {
        this.winnerText.text='Draw';
        this.winnerText.fill='white';
      }
      this.winnerText.visible=true;

      this.player1results.text='Player1: ' + this.player1points + "pts";
      this.player2results.text='Player2: ' + this.player2points + "pts";
      this.player1results.visible=true;
      this.player2results.visible=true;
  },

  unpause: function(){
    console.log("A");
    if(this.game.paused){
      this.game.paused=false;
      this.PausedText.visible=false;
      this.pausebutton.visible=false;
    }
    else{
      this.game.paused=true;
      this.PausedText.visible=true;
      this.pausebutton.visible=true;
    }
  },

  addZeros: function(number) {
    if (number < 10) {
        number= "0" + number;
    }
    return number;
}, 

};

module.exports = PlayScene;