"use strict";

import "babel-polyfill";
import { createPlayer, getRandomInt } from "./assets/Player.js";
import itemDB from "./assets/ItemLibrary";
import Phaser from "./phaser";
import io from "socket.io-client";

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(GAME_CONFIG);

function preload() {
  console.log(this);
  this.playerMap = [];
  this.playerCount = 0;
  this.createPlayer = (x, y, image, name) => {
    let player = createPlayer(this.add.sprite(x, y, image), {
      id: this.playerCount,
      name
    });
    this.playerMap.push(player);
    this.playerCount++;
    return player;
  };

  this.onStartGame = () => {
    this.victory = false;
    this.turnOrder = [...this.playerMap];
    shuffle(this.turnOrder);
    this.currentTurn = 0;
    this.nextTurn = () => {
      if (this.currentTurn !== 0) {
        this.turnOrder[this.currentTurn--].onEndTurn();
        this.turnOrder[this.currentTurn].onStartTurn();
      } else {
        this.turnOrder[this.turnOrder.length - 1].onEndTurn();
        this.turnOrder[this.currentTurn].onStartTurn();
      }

      if (this.currentTurn !== this.turnOrder.length - 1) {
        this.currentTurn++;
      } else {
        this.currentTurn = 0;
      }
    };
  };
  game.Client = {};
  game.Client.socket = io.connect("http://localhost:3333");
  game.Client.addServerPlayer = data => {
    game.Client.socket.emit("newplayer", data);
  };

  game.Client.socket.on("newplayer", data => {
    this.createPlayer(data.x, data.y, data.image, data.name);
  });

  game.Client.socket.on("allplayers", data => {
    for (let i = 0; i < data.length; i++) {
      this.createPlayer(data[i].x, data[i].y, data[i].image, data[i].name);
    }
  });
  this.load.image("player", "assets/player.png");
}

function create() {
  console.log(this);
  game.scene.game.Client.addServerPlayer({
    x: 50,
    y: 50,
    image: "player",
    name: "Spencer"
  });

  this.onStartGame();
}

function update() {}

/*

player1.pickUpItem(itemDB.getRandomCommon());
player1.pickUpItem(itemDB.getItem("dark orb"));

player1.transmuteItem("dark orb");

player2.stealRandomItem(player1);

player2.tradeItem(player1); //optional give and take arguments

*/
