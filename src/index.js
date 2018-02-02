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
  this.load.image("player", "assets/player.png");
}

function create() {
  const player1 = createPlayer(this.add.sprite(50, 50, "player"), {
    id: 1,
    name: "Spencer"
  });
  const player2 = createPlayer(this.add.sprite(300, 300, "player"), {
    id: 2,
    name: "Fred"
  });
}

/*

player1.pickUpItem(itemDB.getRandomCommon());
player1.pickUpItem(itemDB.getItem("dark orb"));

player1.transmuteItem("dark orb");

player2.stealRandomItem(player1);

player2.tradeItem(player1); //optional give and take arguments

*/
