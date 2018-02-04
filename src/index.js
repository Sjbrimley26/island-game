"use strict";

import "babel-polyfill";
import { createPlayer, getRandomInt } from "./assets/Player.js";
import itemDB from "./assets/ItemLibrary";
import Client from "./assets/Client";
import Phaser from "./phaser";

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

function init(game) {
  game.playerMap = [];
  game.playerCount = 0;
  game.createPlayer = (x, y, image, name) => {
    let player = createPlayer(game.add.sprite(x, y, image), {
      id: game.playerCount,
      name
    });
    game.playerMap.push(player);
    game.playerCount++;
    return player;
  };

  game.onStartGame = () => {
    game.victory = false;
    game.turnOrder = [...game.playerMap];
    shuffle(game.turnOrder);
    game.currentTurn = 0;
    game.nextTurn = () => {
      if (game.currentTurn !== 0) {
        game.turnOrder[game.currentTurn--].onEndTurn();
        game.turnOrder[game.currentTurn].onStartTurn();
      } else {
        game.turnOrder[game.turnOrder.length - 1].onEndTurn();
        game.turnOrder[game.currentTurn].onStartTurn();
      }

      if (game.currentTurn !== game.turnOrder.length - 1) {
        game.currentTurn++;
      } else {
        game.currentTurn = 0;
      }
    };
  };
}

function preload() {
  this.load.image("player", "assets/player.png");
  init(this);
}

function create() {
  Client.addNewPlayer({ x: 50, y: 50, image: "player", name: "Spencer" });
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
