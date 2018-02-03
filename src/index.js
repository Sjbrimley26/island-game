"use strict";

import "babel-polyfill";
import { createPlayer, getRandomInt } from "./assets/Player.js";
import itemDB from "./assets/ItemLibrary";
import Phaser from "./phaser";

const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create
  }
};

const game = new Phaser.Game(GAME_CONFIG);

function preload() {
  this.playerMap = [];
  this.playerCount = 0;
  this.createPlayer = (x, y, image, name) => {
    this.playerCount++;
    return createPlayer(this.add.sprite(x, y, image), {
      id: this.playerCount,
      name
    });
  };

  this.load.image("player", "assets/player.png");
}

function create() {
  const player1 = this.createPlayer(50, 50, "player", "Spencer");
  const player2 = this.createPlayer(300, 300, "player", "Fred");
  for (let i = 0; i < 5; i++) {
    player1.pickUpItem(itemDB.getRandomItem());
  }
  player1.pickUpItem(itemDB.getItem("mulligan"));
  player1.useItem("mulligan");
}

/*

player1.pickUpItem(itemDB.getRandomCommon());
player1.pickUpItem(itemDB.getItem("dark orb"));

player1.transmuteItem("dark orb");

player2.stealRandomItem(player1);

player2.tradeItem(player1); //optional give and take arguments

*/
